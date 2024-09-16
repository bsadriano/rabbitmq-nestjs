import { getFullName, User } from '@bsadriano/rmq-nestjs-lib';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GRPC_AUCTION_SERVICE_NAME, GrpcAuctionClient } from 'proto/auction';
import { catchError, firstValueFrom, of } from 'rxjs';
import {
  AUCTION_BID_PLACED_EXCHANGE,
  AUCTION_BID_PLACED_ROUTING_KEY,
} from 'src/constants/services';
import { Auction } from 'src/schemas/auction.schema';
import { BidStatus } from 'src/schemas/bid-status.enum';
import { Bid } from 'src/schemas/bid.schema';
import { PlaceBidRequestDto } from '../dto/place-bid-request.dto';

@Injectable()
export class BidService {
  private grpcAuctionClient: GrpcAuctionClient;
  private logger: Logger = new Logger(BidService.name);

  constructor(
    @Inject('AUCTION_PACKAGE') private clientGrpc: ClientGrpc,
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  onModuleInit() {
    this.grpcAuctionClient = this.clientGrpc.getService<GrpcAuctionClient>(
      GRPC_AUCTION_SERVICE_NAME,
    );
  }

  async placeBid(user: User, { auctionId, amount }: PlaceBidRequestDto) {
    try {
      let auction: any = await this.auctionModel.findOne({ id: auctionId });

      if (auction === null) {
        this.logger.log('Fetching auction in service');

        const response = await firstValueFrom(
          this.grpcAuctionClient.getAuction({ id: auctionId }).pipe(
            catchError((error) => {
              this.logger.log('Error in grpc: ' + error.message);
              return of(null);
            }),
          ),
        );

        const { id, auctionEnd, seller, reservePrice, updatedAt } =
          response.auction;
        auction = response.auction;

        await this.auctionModel.create({
          id,
          auctionEnd,
          seller,
          reservePrice,
          updatedAt,
        });
      }

      if (auction === null) {
        throw new BadRequestException(
          'Cannot accept bids on this auction at this time',
        );
      }

      if (auction.seller === getFullName(user.firstName, user.lastName)) {
        throw new BadRequestException('You cannot bid on your own item');
      }

      const bidData = {
        auctionId,
        amount,
        bidder: getFullName(user.firstName, user.lastName),
      };

      const createdBid = new this.bidModel(bidData);

      const bidStatus = await this.getBidStatus(auction, amount);
      createdBid.bidStatus = bidStatus;

      createdBid.save();

      this.amqpConnection.publish(
        AUCTION_BID_PLACED_EXCHANGE,
        AUCTION_BID_PLACED_ROUTING_KEY,
        {
          message: {
            ...bidData,
            id: auctionId,
            bidStatus,
          },
        },
      );

      return createdBid;
    } catch (error) {
      this.logger.error('An error occurred:', error.message, error.stack);
      throw new BadRequestException(
        'Failed to place bid on auction: ' + error.message,
      );
    }
  }

  private async getBidStatus(auction: Auction, amount: number) {
    let bidStatus;
    if (auction.auctionEnd < new Date()) {
      bidStatus = BidStatus.FINISHED;
    } else {
      const highBid = await this.bidModel
        .findOne({ auctionId: auction.id })
        .sort('-amount');

      if (highBid == null || (highBid !== null && amount >= highBid.amount)) {
        bidStatus =
          amount > auction.reservePrice
            ? BidStatus.ACCEPTED
            : BidStatus.ACCEPTED_BELOW_RESERVE;
      }

      if (highBid !== null && amount < highBid.amount) {
        bidStatus = BidStatus.TOO_LOW;
      }
    }
    return bidStatus;
  }

  getBidsForAuction(auctionId: number) {
    this.auctionModel.find({ auctionId });
  }
}

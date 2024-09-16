import {
  AuctionBidPlacedDto,
  AuctionFinishedDto,
  AuctionStatus,
  RMQMessage,
  Serialize,
} from '@bsadriano/rmq-nestjs-lib';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AUCTION_BID_PLACED_EXCHANGE,
  AUCTION_CMD_FINISHED,
  AUCTION_FINISHED_EXCHANGE,
  AUCTION_SERVICE,
  USER_CMD_CREATE,
  USER_CMD_GET_USER_BY_ID,
  USER_CMD_GET_USERS,
  USER_CMD_VALIDATE,
  USER_EXCHANGE,
  USER_SERVICE,
} from 'src/constants/services';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Auction } from '../../auction/entities/auction.entity';
import { BidStatus } from '../../auction/entities/bid-status.enum';

@Injectable()
export class ConsumersSevice {
  private logger = new Logger(ConsumersSevice.name);

  constructor(
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    private readonly usersService: UsersService,
  ) {}

  @RMQMessage({
    exchange: AUCTION_BID_PLACED_EXCHANGE,
    service: 'auction',
    cmd: 'bid-placed',
    type: 'sub',
  })
  async handleBidPlaced({
    message: { id, amount, bidStatus },
  }: {
    message: AuctionBidPlacedDto;
  }) {
    this.logger.verbose('Consuming bid placed');

    const auction = await this.auctionRepository.findOneByOrFail({ id });

    if (
      auction.currentHighBid == null ||
      (bidStatus === BidStatus.ACCEPTED && amount > auction.currentHighBid)
    ) {
      this.logger.verbose('Updating high bid');
      auction.currentHighBid = amount;
    }

    this.auctionRepository.save(auction);
  }

  @RMQMessage({
    exchange: AUCTION_FINISHED_EXCHANGE,
    service: AUCTION_SERVICE,
    cmd: AUCTION_CMD_FINISHED,
    type: 'sub',
  })
  async handleFinishAuction({
    message: { id, itemSold, soldAmount, winner },
  }: {
    message: AuctionFinishedDto;
  }) {
    this.logger.verbose('Consuming auction finished');

    const auction = await this.auctionRepository.findOneByOrFail({
      id,
    });

    if (itemSold) {
      auction.winner = winner;
      auction.soldAmount = soldAmount;
    }

    auction.status =
      auction.soldAmount > auction.reservePrice
        ? AuctionStatus.FINISHED
        : AuctionStatus.RESERVE_NOT_MET;

    this.logger.verbose('Updated auction: ', JSON.stringify(auction));

    this.auctionRepository.save(auction);
  }

  @RMQMessage({
    exchange: USER_EXCHANGE,
    service: USER_SERVICE,
    cmd: USER_CMD_CREATE,
    type: 'rpc',
  })
  @Serialize(UserDto)
  async handleCreateUser({ message }: { message: CreateUserDto }) {
    this.logger.verbose(
      `Consuming create user with message: ${JSON.stringify(message)}`,
    );

    return this.usersService.create(message);
  }

  @RMQMessage({
    exchange: USER_EXCHANGE,
    service: USER_SERVICE,
    cmd: USER_CMD_VALIDATE,
    type: 'rpc',
  })
  @Serialize(UserDto)
  async handleValidateUser({
    message,
  }: {
    message: { email: string; password: string };
  }) {
    this.logger.verbose(
      `Consuming validate user with message: ${JSON.stringify(message)}`,
    );

    return this.usersService.validateUser(message);
  }

  @RMQMessage({
    exchange: USER_EXCHANGE,
    service: USER_SERVICE,
    cmd: USER_CMD_GET_USERS,
    type: 'rpc',
  })
  async handleGetusers() {
    this.logger.verbose(`Consuming get users`);

    return this.usersService.findAll();
  }

  @RMQMessage({
    exchange: USER_EXCHANGE,
    service: USER_SERVICE,
    cmd: USER_CMD_GET_USER_BY_ID,
    type: 'rpc',
  })
  async handleGetUser({ message: { id } }: { message: { id: number } }) {
    this.logger.verbose(
      `Consuming get user by id with message: ${JSON.stringify({ id })}`,
    );

    return this.usersService.findOne(id);
  }
}

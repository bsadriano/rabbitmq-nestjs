import { AuctionCreatedDto, RMQMessage } from '@bsadriano/rmq-nestjs-lib';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AUCTION_CMD_CREATED,
  AUCTION_CREATED_EXCHANGE,
  AUCTION_SERVICE,
} from 'src/constants/services';
import { Auction } from 'src/schemas/auction.schema';

@Injectable()
export class QueueService {
  private logger = new Logger(QueueService.name);

  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
  ) {}

  async create(payload: AuctionCreatedDto) {
    return await this.auctionModel.create(payload);
  }

  @RMQMessage({
    exchange: AUCTION_CREATED_EXCHANGE,
    service: AUCTION_SERVICE,
    cmd: AUCTION_CMD_CREATED,
    type: 'sub',
  })
  async handleAuctionCreated({ message }: { message: AuctionCreatedDto }) {
    this.logger.verbose(
      `Handling auction added with data: "${JSON.stringify(message)}"`,
    );

    await this.auctionModel.create(message);

    this.logger.verbose('Successfully added auction ');
  }
}

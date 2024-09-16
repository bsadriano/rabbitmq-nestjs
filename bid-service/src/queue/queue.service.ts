import { AuctionCreatedDto } from '@bsadriano/rmq-nestjs-lib';
import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AUCTION_CREATED_EXCHANGE,
  AUCTION_CREATED_ROUTING_KEY,
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

  @RabbitSubscribe({
    exchange: AUCTION_CREATED_EXCHANGE,
    routingKey: AUCTION_CREATED_ROUTING_KEY,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
  })
  async handleAuctionCreated({ message }: { message: AuctionCreatedDto }) {
    this.logger.verbose(
      `Handling auction added with data: "${JSON.stringify(message)}"`,
    );

    await this.auctionModel.create(message);

    this.logger.verbose('Successfully added auction ');
  }
}

import {
  AuctionBidPlacedDto,
  AuctionCreatedDto,
  AuctionDeletedDto,
  AuctionFinishedDto,
  AuctionUpdatedDto,
} from '@bsadriano/rmq-nestjs-lib';
import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import {
  AUCTION_BID_PLACED_EXCHANGE,
  AUCTION_BID_PLACED_ROUTING_KEY,
  AUCTION_CREATED_EXCHANGE,
  AUCTION_CREATED_ROUTING_KEY,
  AUCTION_DELETED_EXCHANGE,
  AUCTION_DELETED_ROUTING_KEY,
  AUCTION_FINISHED_EXCHANGE,
  AUCTION_FINISHED_ROUTING_KEY,
  AUCTION_UPDATED_EXCHANGE,
  AUCTION_UPDATED_ROUTING_KEY,
} from 'src/constants/services';
import { CreateItemInput } from 'src/search/dto/item.inputs';
import { SearchService } from 'src/search/services/search.service';

@Injectable()
export class QueueService {
  private logger = new Logger(QueueService.name);

  constructor(private searchService: SearchService) {}

  @RabbitSubscribe({
    exchange: AUCTION_CREATED_EXCHANGE,
    routingKey: AUCTION_CREATED_ROUTING_KEY,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
  })
  async handleAuctionCreated({ message }: { message: AuctionCreatedDto }) {
    this.logger.verbose(
      `Handling auction added with data: "${JSON.stringify(message)}"`,
    );

    await this.searchService.create({
      ...message,
      carModel: message.model,
    } as CreateItemInput);

    this.logger.verbose('Successfully added auction ');
  }

  @RabbitSubscribe({
    exchange: AUCTION_UPDATED_EXCHANGE,
    routingKey: AUCTION_UPDATED_ROUTING_KEY,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
  })
  async handleAuctionUpdated({ message }: { message: AuctionUpdatedDto }) {
    this.logger.verbose(
      `Handling auction updated with id #${message.id}, and data: "${JSON.stringify(message)}"`,
    );

    await this.searchService.update(message);

    this.logger.verbose('Successfully updated auction');
  }

  @RabbitSubscribe({
    exchange: AUCTION_DELETED_EXCHANGE,
    routingKey: AUCTION_DELETED_ROUTING_KEY,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
  })
  async handleAuctionDeleted({
    message: { id },
  }: {
    message: AuctionDeletedDto;
  }) {
    this.logger.verbose(`Handling auction deleted with id #${id}`);

    await this.searchService.deleteById(id);

    this.logger.verbose('Successfully deleted auction');
  }

  @RabbitSubscribe({
    exchange: AUCTION_BID_PLACED_EXCHANGE,
    routingKey: AUCTION_BID_PLACED_ROUTING_KEY,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
  })
  async handleBidPlaced({ message }: { message: AuctionBidPlacedDto }) {
    this.logger.verbose('Consuming bid placed');

    await this.searchService.placeBid(message);
  }

  @RabbitSubscribe({
    exchange: AUCTION_FINISHED_EXCHANGE,
    routingKey: AUCTION_FINISHED_ROUTING_KEY,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
  })
  async handleAuctionFinished({ message }: { message: AuctionFinishedDto }) {
    this.logger.verbose('Consuming auction finished');

    await this.searchService.finishAuction(message);
  }
}

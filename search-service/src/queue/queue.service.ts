import {
  AuctionBidPlacedDto,
  AuctionCreatedDto,
  AuctionDeletedDto,
  AuctionFinishedDto,
  AuctionUpdatedDto,
  RMQMessage,
} from '@bsadriano/rmq-nestjs-lib';
import { Injectable, Logger } from '@nestjs/common';
import {
  AUCTION_BID_PLACED_EXCHANGE,
  AUCTION_CMD_BID_PLACED,
  AUCTION_CMD_CREATED,
  AUCTION_CMD_DELETED,
  AUCTION_CMD_FINISHED,
  AUCTION_CMD_UPDATED,
  AUCTION_CREATED_EXCHANGE,
  AUCTION_DELETED_EXCHANGE,
  AUCTION_FINISHED_EXCHANGE,
  AUCTION_SERVICE,
  AUCTION_UPDATED_EXCHANGE,
} from 'src/constants/services';
import { CreateItemInput } from 'src/search/dto/item.inputs';
import { SearchService } from 'src/search/services/search.service';

@Injectable()
export class QueueService {
  private logger = new Logger(QueueService.name);

  constructor(private searchService: SearchService) {}

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

    await this.searchService.create({
      ...message,
      carModel: message.model,
    } as CreateItemInput);

    this.logger.verbose('Successfully added auction ');
  }

  @RMQMessage({
    exchange: AUCTION_UPDATED_EXCHANGE,
    service: AUCTION_SERVICE,
    cmd: AUCTION_CMD_UPDATED,
    type: 'sub',
  })
  async handleAuctionUpdated({ message }: { message: AuctionUpdatedDto }) {
    this.logger.verbose(
      `Handling auction updated with id #${message.id}, and data: "${JSON.stringify(message)}"`,
    );

    await this.searchService.update(message);

    this.logger.verbose('Successfully updated auction');
  }

  @RMQMessage({
    exchange: AUCTION_DELETED_EXCHANGE,
    service: AUCTION_SERVICE,
    cmd: AUCTION_CMD_DELETED,
    type: 'sub',
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

  @RMQMessage({
    exchange: AUCTION_BID_PLACED_EXCHANGE,
    service: AUCTION_SERVICE,
    cmd: AUCTION_CMD_BID_PLACED,
    type: 'sub',
  })
  async handleBidPlaced({ message }: { message: AuctionBidPlacedDto }) {
    this.logger.verbose('Consuming bid placed');

    await this.searchService.placeBid(message);
  }

  @RMQMessage({
    exchange: AUCTION_FINISHED_EXCHANGE,
    service: AUCTION_SERVICE,
    cmd: AUCTION_CMD_FINISHED,
    type: 'sub',
  })
  async handleAuctionFinished({ message }: { message: AuctionFinishedDto }) {
    this.logger.verbose('Consuming auction finished');

    await this.searchService.finishAuction(message);
  }
}

import {
  AuctionCreatedDto,
  AuctionDeletedDto,
  AuctionUpdatedDto,
  RMQMessage,
} from '@bsadriano/rmq-nestjs-lib';
import { Injectable, Logger } from '@nestjs/common';
import {
  AUCTION_CMD_CREATED,
  AUCTION_CMD_DELETED,
  AUCTION_CMD_UPDATED,
  AUCTION_CREATED_EXCHANGE,
  AUCTION_DELETED_EXCHANGE,
  AUCTION_SERVICE,
  AUCTION_UPDATED_EXCHANGE,
} from 'src/services';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class ConsumersService {
  private logger = new Logger(ConsumersService.name);

  constructor(private readonly socketService: SocketService) {}

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

    this.socketService.socket.emit('AuctionCreated', message);
  }

  @RMQMessage({
    exchange: AUCTION_UPDATED_EXCHANGE,
    service: AUCTION_SERVICE,
    cmd: AUCTION_CMD_UPDATED,
    type: 'sub',
  })
  async handleAuctionUpdated({ message }: { message: AuctionUpdatedDto }) {
    this.logger.verbose(
      `Handling auction updated with data: "${JSON.stringify(message)}"`,
    );

    this.socketService.socket.emit('AuctionUpdated', message);
  }

  @RMQMessage({
    exchange: AUCTION_DELETED_EXCHANGE,
    service: AUCTION_SERVICE,
    cmd: AUCTION_CMD_DELETED,
    type: 'sub',
  })
  async handleAuctionDeleted({ message }: { message: AuctionDeletedDto }) {
    this.logger.verbose(
      `Handling auction deleted with data: "${JSON.stringify(message)}"`,
    );

    this.socketService.socket.emit('AuctionDeleted', message);
  }
}

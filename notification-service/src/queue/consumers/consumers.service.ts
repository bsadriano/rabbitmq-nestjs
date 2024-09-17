import {
  AuctionBidPlacedDto,
  AuctionCreatedDto,
  AuctionFinishedDto,
  RMQMessage,
} from '@bsadriano/rmq-nestjs-lib';
import { Injectable, Logger } from '@nestjs/common';
import {
  AUCTION_BID_PLACED_EXCHANGE,
  AUCTION_CMD_BID_PLACED,
  AUCTION_CMD_CREATED,
  AUCTION_CMD_FINISHED,
  AUCTION_CREATED_EXCHANGE,
  AUCTION_FINISHED_EXCHANGE,
  AUCTION_SERVICE,
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
    exchange: AUCTION_FINISHED_EXCHANGE,
    service: AUCTION_SERVICE,
    cmd: AUCTION_CMD_FINISHED,
    type: 'sub',
  })
  async handleAuctionFinished({ message }: { message: AuctionFinishedDto }) {
    this.logger.verbose(
      `Handling auction finished with data: "${JSON.stringify(message)}"`,
    );

    this.socketService.socket.emit('AuctionFinished', message);
  }

  @RMQMessage({
    exchange: AUCTION_BID_PLACED_EXCHANGE,
    service: AUCTION_SERVICE,
    cmd: AUCTION_CMD_BID_PLACED,
    type: 'sub',
  })
  async handleAuctionBidPlaced({ message }: { message: AuctionBidPlacedDto }) {
    this.logger.verbose(
      `Handling auction bid placed with data: "${JSON.stringify(message)}"`,
    );

    this.socketService.socket.emit('BidPlaced', message);
  }
}

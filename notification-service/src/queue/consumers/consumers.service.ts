import { AuctionCreatedDto } from '@bsadriano/rmq-nestjs-lib';
import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import {
  AUCTION_CREATED_EXCHANGE_NAME,
  AUCTION_CREATED_ROUTING_KEY,
} from 'src/services';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class ConsumersService {
  private logger = new Logger(ConsumersService.name);

  constructor(private readonly socketService: SocketService) {}

  @RabbitSubscribe({
    exchange: AUCTION_CREATED_EXCHANGE_NAME,
    routingKey: AUCTION_CREATED_ROUTING_KEY,
    errorBehavior: MessageHandlerErrorBehavior.ACK,
  })
  async handleAuctionCreated({ message }: { message: AuctionCreatedDto }) {
    this.logger.verbose(
      `Handling auction added with data: "${JSON.stringify(message)}"`,
    );

    this.socketService.socket.emit('AuctionCreated', message);
  }
}

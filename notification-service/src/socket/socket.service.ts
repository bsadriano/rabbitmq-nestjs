import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { RMQMessage } from '@bsadriano/rmq-nestjs-lib';

@Injectable()
export class SocketService {
  public socket: Server = null;

  @RMQMessage({
    type: 'auction.created',
  })
  handleAuctionCreated() {}
}

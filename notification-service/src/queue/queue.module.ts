import { RmqModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import {
  AUCTION_BID_PLACED_EXCHANGE,
  AUCTION_CREATED_EXCHANGE,
  AUCTION_FINISHED_EXCHANGE,
} from 'src/services';
import { SocketModule } from 'src/socket/socket.module';
import { ConsumersService } from './consumers/consumers.service';

@Module({
  imports: [
    SocketModule,
    RmqModule.register({
      exchanges: [
        {
          name: AUCTION_CREATED_EXCHANGE,
          type: 'fanout',
        },
        {
          name: AUCTION_BID_PLACED_EXCHANGE,
          type: 'fanout',
        },
        {
          name: AUCTION_FINISHED_EXCHANGE,
          type: 'fanout',
        },
      ],
    }),
  ],
  providers: [ConsumersService],
})
export class QueueModule {}

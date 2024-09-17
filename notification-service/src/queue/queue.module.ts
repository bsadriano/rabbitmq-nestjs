import { RmqModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import {
  AUCTION_CREATED_EXCHANGE,
  AUCTION_DELETED_EXCHANGE,
  AUCTION_UPDATED_EXCHANGE,
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
          name: AUCTION_UPDATED_EXCHANGE,
          type: 'fanout',
        },
        {
          name: AUCTION_DELETED_EXCHANGE,
          type: 'fanout',
        },
      ],
    }),
  ],
  providers: [ConsumersService],
})
export class QueueModule {}

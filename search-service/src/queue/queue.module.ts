import { RmqModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import {
  AUCTION_BID_PLACED_EXCHANGE,
  AUCTION_CREATED_EXCHANGE,
  AUCTION_DELETED_EXCHANGE,
  AUCTION_FINISHED_EXCHANGE,
  AUCTION_UPDATED_EXCHANGE,
} from 'src/constants/services';
import { SearchModule } from 'src/search/search.module';
import { QueueService } from './queue.service';

@Module({
  imports: [
    SearchModule,
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
  controllers: [],
  providers: [QueueService],
})
export class QueueModule {}

import { Module } from '@nestjs/common';
import {
  AUCTION_BID_PLACED_EXCHANGE_NAME,
  AUCTION_CREATED_EXCHANGE_NAME,
  AUCTION_DELETED_EXCHANGE_NAME,
  AUCTION_FINISHED_EXCHANGE_NAME,
  AUCTION_UPDATED_EXCHANGE_NAME,
} from 'src/constants/services';
import { SearchModule } from 'src/search/search.module';
import { RmqModule } from '../rmq/rmq.module';
import { QueueService } from './queue.service';

@Module({
  imports: [
    SearchModule,
    RmqModule.register({
      exchanges: [
        {
          name: AUCTION_CREATED_EXCHANGE_NAME,
          type: 'fanout',
        },
        {
          name: AUCTION_UPDATED_EXCHANGE_NAME,
          type: 'fanout',
        },
        {
          name: AUCTION_DELETED_EXCHANGE_NAME,
          type: 'fanout',
        },
        {
          name: AUCTION_BID_PLACED_EXCHANGE_NAME,
          type: 'fanout',
        },
        {
          name: AUCTION_FINISHED_EXCHANGE_NAME,
          type: 'fanout',
        },
      ],
    }),
  ],
  controllers: [],
  providers: [QueueService],
})
export class QueueModule {}

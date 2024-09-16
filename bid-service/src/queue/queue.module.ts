import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AUCTION_CREATED_EXCHANGE } from 'src/constants/services';
import { Auction, auctionSchema } from 'src/schemas/auction.schema';
import { RmqModule } from '../rmq/rmq.module';
import { QueueService } from './queue.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auction.name, schema: auctionSchema }]),
    RmqModule.register({
      exchanges: [
        {
          name: AUCTION_CREATED_EXCHANGE,
          type: 'fanout',
        },
      ],
    }),
  ],
  controllers: [],
  providers: [QueueService],
})
export class QueueModule {}

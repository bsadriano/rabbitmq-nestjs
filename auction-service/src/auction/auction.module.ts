import { RmqModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from 'src/queue/queue.module';
import { User } from 'src/users/entities/user.entity';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { Auction } from './entities/auction.entity';
import { Item } from './entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, Item, User]),
    QueueModule,
    RmqModule.register({
      exchanges: [
        {
          name: 'user-exchange',
          type: 'topic',
        },
      ],
    }),
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}

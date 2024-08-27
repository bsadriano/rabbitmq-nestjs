import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { Auction } from './entities/auction.entity';
import { Item } from './entities/item.entity';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, Item]), QueueModule],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}

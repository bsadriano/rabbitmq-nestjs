import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from 'src/auction/entities/auction.entity';
import { Item } from 'src/auction/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { GrpcAuctionController } from './grpc-auction.controller';
import { GrpcAuctionService } from './grpc-auction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, Item, User])],
  controllers: [GrpcAuctionController],
  providers: [GrpcAuctionService],
})
export class GrpcAuctionModule {}

import { Injectable } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataFactory, seeder, Seeder } from 'nestjs-seeder';
import { DeepPartial } from 'typeorm';
import { AuctionModule } from '../auction.module';
import { AuctionService } from '../auction.service';
import { Auction } from '../entities/auction.entity';
import { Item } from '../entities/item.entity';

@Injectable()
export class AuctionSeeder implements Seeder {
  auctions: DeepPartial<Auction>[];
  constructor(private readonly auctionService: AuctionService) {
    const auctions = DataFactory.createForClass(Auction).generate(
      10,
    ) as DeepPartial<Auction>[];
    const items = DataFactory.createForClass(Item).generate(
      10,
    ) as DeepPartial<Item>[];

    for (let i = 0; i < auctions.length; i++) {
      auctions[i].item = items[i];
    }

    this.auctions = auctions;
  }

  async seed(): Promise<any> {
    return this.auctionService.save(this.auctions);
  }

  async drop(): Promise<any> {
    return this.auctionService.deleteAll();
  }
}

seeder({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Auction]),
    AuctionModule,
  ],
}).run([AuctionSeeder]);

import { Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataFactory, seeder, Seeder } from 'nestjs-seeder';
import { User } from 'src/users/entities/user.entity';
import { DeepPartial } from 'typeorm';
import configuration from '../../config/configuration';
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

    this.auctions = auctions.map((auction, i) => {
      auction.item = items[i];
      return auction;
    });
  }

  async seed(): Promise<any> {
    const user: DeepPartial<User> = {
      username: 'bob',
      email: 'bob@email.com',
      firstName: 'Bob',
      lastName: 'Vance',
      password: await bcrypt.hash('pass123', 10),
    };

    return this.auctionService.save(
      this.auctions.map((auction) => {
        auction.seller = user;
        return auction;
      }),
    );
  }

  async drop(): Promise<any> {
    return this.auctionService.deleteAll();
  }
}

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      autoLoadEntities: true,
      entities: [Auction, User],
      synchronize: true,
    }),
    AuctionModule,
  ],
}).run([AuctionSeeder]);

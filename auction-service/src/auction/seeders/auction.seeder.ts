import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('database.type') as 'aurora-mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        autoLoadEntities: true,
        entities: [Auction, User],
        synchronize: configService.get<boolean>('database.synchronize'),
      }),
      inject: [ConfigService],
    }),
    AuctionModule,
  ],
}).run([AuctionSeeder]);

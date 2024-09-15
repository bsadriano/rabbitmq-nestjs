import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';
import { AuctionSeeder } from './bid/auction.seeder';
import { AuctionSvcHttpClientService } from './bid/services/auction-svc-http-client.service';
import configuration from './config/configuration';
import { Auction, auctionSchema } from './schemas/auction.schema';

seeder({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    HttpModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('mongodb.uri'),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Auction.name, schema: auctionSchema }]),
  ],
  providers: [AuctionSvcHttpClientService],
}).run([AuctionSeeder]);

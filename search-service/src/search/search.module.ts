import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { SearchResolver } from './search.resolver';
import { AuctionSvcHttpClientService } from './services/auction-svc-http-client.service';
import { SearchService } from './services/search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Item]),
    // MongooseModule.forFeature([{ name: Item.name, schema: itemSchema }]),
    AuthModule,
  ],
  providers: [SearchResolver, SearchService, AuctionSvcHttpClientService],
  exports: [SearchService, AuctionSvcHttpClientService],
})
export class SearchModule {}

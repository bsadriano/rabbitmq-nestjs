import { AuthModule } from '@bsadriano/rmq-nestjs-lib';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, itemSchema } from './item.schema';
import { SearchResolver } from './search.resolver';
import { AuctionSvcHttpClientService } from './services/auction-svc-http-client.service';
import { SearchService } from './services/search.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Item.name, schema: itemSchema }]),
    AuthModule,
  ],
  providers: [SearchResolver, SearchService, AuctionSvcHttpClientService],
  exports: [SearchService, AuctionSvcHttpClientService],
})
export class SearchModule {}

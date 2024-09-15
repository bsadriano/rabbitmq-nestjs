import { AUTH_EXCHANGE, RmqModule } from '@bsadriano/rmq-nestjs-lib';
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
    RmqModule.register({
      exchanges: [
        {
          name: AUTH_EXCHANGE,
          type: 'topic',
        },
      ],
    }),
  ],
  providers: [SearchResolver, SearchService, AuctionSvcHttpClientService],
  exports: [SearchService, AuctionSvcHttpClientService],
})
export class SearchModule {}

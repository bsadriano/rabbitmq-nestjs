import { AUTH_EXCHANGE, RmqModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from 'src/auction/entities/auction.entity';
import { Item } from 'src/auction/entities/item.entity';
import {
  AUCTION_BID_PLACED_EXCHANGE_NAME,
  AUCTION_CREATED_EXCHANGE_NAME,
  AUCTION_DELETED_EXCHANGE_NAME,
  AUCTION_FINISHED_EXCHANGE_NAME,
  AUCTION_UPDATED_EXCHANGE_NAME,
  USER_EXCHANGE,
} from 'src/constants/services';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { ConsumersSevice } from './services/consumers.service';
import { ProducerService } from './services/producer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, Item, User]),
    RmqModule.register({
      exchanges: [
        {
          name: AUCTION_CREATED_EXCHANGE_NAME,
          type: 'fanout',
        },
        {
          name: AUCTION_UPDATED_EXCHANGE_NAME,
          type: 'fanout',
        },
        {
          name: AUCTION_DELETED_EXCHANGE_NAME,
          type: 'fanout',
        },
        {
          name: AUCTION_BID_PLACED_EXCHANGE_NAME,
          type: 'fanout',
        },
        {
          name: AUCTION_FINISHED_EXCHANGE_NAME,
          type: 'fanout',
        },
        {
          name: AUTH_EXCHANGE,
          type: 'topic',
        },
        {
          name: USER_EXCHANGE,
          type: 'topic',
        },
      ],
    }),
    UsersModule,
  ],
  providers: [ProducerService, ConsumersSevice],
  exports: [ProducerService],
})
export class QueueModule {}

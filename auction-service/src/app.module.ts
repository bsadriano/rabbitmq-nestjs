import { DatabaseModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuctionModule } from './auction/auction.module';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { GrpcAuctionModule } from './grpc-auction/grpc-auction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule.forRoot(),
    AuctionModule,
    UsersModule,
    GrpcAuctionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

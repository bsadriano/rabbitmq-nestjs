import { DatabaseModule, HealthModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuctionModule } from './auction/auction.module';
import configuration from './config/configuration';
import { GrpcAuctionModule } from './grpc-auction/grpc-auction.module';
import { GrpcConfigService } from './grpc-auction/grpc-config.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule.forRoot(),
    HealthModule,
    AuctionModule,
    UsersModule,
    GrpcAuctionModule,
  ],
  controllers: [],
  providers: [GrpcConfigService],
  exports: [GrpcConfigService],
})
export class AppModule {}

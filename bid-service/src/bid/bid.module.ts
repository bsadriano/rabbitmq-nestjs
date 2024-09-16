import { ReflectionService } from '@grpc/reflection';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AUCTION_BID_PLACED_EXCHANGE } from 'src/constants/services';
import { Auction, auctionSchema } from 'src/schemas/auction.schema';
import { Bid, bidSchema } from 'src/schemas/bid.schema';
import { RmqModule } from '../rmq/rmq.module';
import { BidController } from './bid.controller';
import { BidService } from './services/bid.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUCTION_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auction',
          protoPath: join(__dirname, '../../auction.proto'),
          url: 'localhost:5001',
          onLoadPackageDefinition: (pkg, server) => {
            new ReflectionService(pkg).addToServer(server);
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: Auction.name, schema: auctionSchema },
      { name: Bid.name, schema: bidSchema },
    ]),
    RmqModule.register({
      exchanges: [
        {
          name: AUCTION_BID_PLACED_EXCHANGE,
          type: 'fanout',
        },
      ],
    }),
  ],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}

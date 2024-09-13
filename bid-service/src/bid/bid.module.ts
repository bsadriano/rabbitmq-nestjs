import { ReflectionService } from '@grpc/reflection';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, bidSchema } from 'src/schemas/bid.schema';
import { AuthModule } from '@bsadriano/rmq-nestjs-lib';

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
    MongooseModule.forFeature([{ name: Bid.name, schema: bidSchema }]),
    AuthModule.register(),
  ],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}

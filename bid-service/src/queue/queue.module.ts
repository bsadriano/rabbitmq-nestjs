import { RmqModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, bidSchema } from 'src/schemas/bid.schema';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bid.name, schema: bidSchema }]),
    RmqModule,
  ],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}

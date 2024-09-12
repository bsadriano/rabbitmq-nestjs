import { RmqModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import { AUCTION_QUEUE, AUCTION_SERVICE } from 'src/constants/services';
import { ProducerService } from './services/producer.service';

@Module({
  imports: [
    RmqModule.register({ name: AUCTION_SERVICE, queue: AUCTION_QUEUE }),
  ],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class QueueModule {}

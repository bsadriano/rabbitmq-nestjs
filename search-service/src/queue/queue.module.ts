import { RmqModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import { SearchModule } from 'src/search/search.module';
import { QueueController } from './queue.controller';

@Module({
  imports: [SearchModule, RmqModule],
  controllers: [QueueController],
  providers: [],
})
export class QueueModule {}

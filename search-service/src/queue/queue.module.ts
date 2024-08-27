import { Module } from '@nestjs/common';
import { SearchModule } from 'src/search/search.module';
import { QueueController } from './queue.controller';
import { RmqModule } from 'src/rmq/rmq.module';

@Module({
  imports: [SearchModule, RmqModule],
  controllers: [QueueController],
  providers: [],
})
export class QueueModule {}

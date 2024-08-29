import { Module } from '@nestjs/common';
import { RmqModule } from 'src/rmq/rmq.module';
import { SearchModule } from 'src/search/search.module';
import { QueueController } from './queue.controller';

@Module({
  imports: [SearchModule, RmqModule],
  controllers: [QueueController],
  providers: [],
})
export class QueueModule {}

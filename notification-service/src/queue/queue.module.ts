import { Module } from '@nestjs/common';
import { ConsumersService } from './consumers/consumers.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  providers: [ConsumersService, SocketModule],
})
export class QueueModule {}

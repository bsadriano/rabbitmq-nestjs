import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification/notification.gateway';
import { QueueModule } from './queue/queue.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [QueueModule, SocketModule],
  controllers: [],
  providers: [NotificationGateway],
})
export class AppModule {}

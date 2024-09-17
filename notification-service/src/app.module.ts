import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification/notification.gateway';
import { QueueModule } from './queue/queue.module';
import { SocketModule } from './socket/socket.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    QueueModule,
    SocketModule,
  ],
  controllers: [],
  providers: [NotificationGateway],
})
export class AppModule {}

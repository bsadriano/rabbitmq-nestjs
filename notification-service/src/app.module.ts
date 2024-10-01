import { HealthModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { NotificationGateway } from './notification/notification.gateway';
import { QueueModule } from './queue/queue.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    HealthModule,
    QueueModule,
    SocketModule,
  ],
  providers: [NotificationGateway],
})
export class AppModule {}

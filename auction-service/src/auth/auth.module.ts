import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AUTH_QUEUE, AUTH_SERVICE } from 'src/constants/services';
import { RmqModule } from '../rmq/rmq.module';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [RmqModule.register({ name: AUTH_SERVICE, queue: AUTH_QUEUE })],
  exports: [RmqModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}

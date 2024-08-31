import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AUCTION_BID_PLACED_QUEUE,
  AUCTION_FINISHED_QUEUE,
  AUCTION_QUEUE,
} from './constants/services';
import { RmqService } from './rmq/rmq.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(AUCTION_QUEUE));
  app.connectMicroservice(rmqService.getOptions(AUCTION_FINISHED_QUEUE));
  app.connectMicroservice(rmqService.getOptions(AUCTION_BID_PLACED_QUEUE));

  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('port'));
}
bootstrap();

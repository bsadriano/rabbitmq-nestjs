import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AUCTION_QUEUE } from './constants/services';
import { RmqService } from './rmq/rmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(AUCTION_QUEUE));

  await app.startAllMicroservices();
  await app.listen(7002);
}
bootstrap();

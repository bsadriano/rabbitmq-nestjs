import { RmqService } from '@bsadriano/rmq-nestjs-lib';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AUCTION_BID_PLACED_QUEUE,
  AUCTION_FINISHED_QUEUE,
  USER_QUEUE,
} from './constants/services';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(USER_QUEUE));
  app.connectMicroservice(rmqService.getOptions(AUCTION_FINISHED_QUEUE));
  app.connectMicroservice(rmqService.getOptions(AUCTION_BID_PLACED_QUEUE));

  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('port'));
}
bootstrap();

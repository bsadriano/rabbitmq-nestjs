import { RmqService } from '@bsadriano/rmq-nestjs-lib';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AUCTION_QUEUE } from './constants/services';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(AUCTION_QUEUE));

  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('port'));
}
bootstrap();

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientGrpcProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';

@Injectable()
export class GrpcConfigService {
  constructor(private configService: ConfigService) {}

  get getGrpcClientOptions(): ClientGrpcProxy {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: 'auction',
        url: this.configService.get<string>('grpc.url'),
        protoPath: join(__dirname, '../../auction.proto'),
      },
    });
    // return {
    //   transport: Transport.GRPC,
    //   options: {
    //     package: 'auction',
    //     url: this.configService.get<string>('grpc.url'),
    //     protoPath: join(__dirname, '../auction.proto'),
    //   },
    // } as GrpcOptions;
  }
}

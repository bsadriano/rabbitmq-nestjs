import { RmqModule } from '@bsadriano/rmq-nestjs-lib';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { USER_EXCHANGE } from 'src/constants/services';
import { RmqModule as MyRmqModule } from '../rmq/rmq.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: `${configService.get<number>('jwt.expiration')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    RmqModule,
    MyRmqModule.register({
      exchanges: [
        {
          name: USER_EXCHANGE,
          type: 'topic',
        },
        {
          name: 'auth-exchange',
          type: 'topic',
        },
      ],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}

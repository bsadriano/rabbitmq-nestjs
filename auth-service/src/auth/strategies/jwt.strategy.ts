import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  USER_EXCHANGE,
  USER_GET_USER_BY_ID_ROUTING_KEY,
} from 'src/constants/services';
import { TokenPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly amqpConnection: AmqpConnection,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => request?.message?.Authentication,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload) {
    try {
      return await this.amqpConnection.request({
        exchange: USER_EXCHANGE,
        routingKey: USER_GET_USER_BY_ID_ROUTING_KEY,
        payload: {
          message: {
            id: userId,
          },
        },
      });
    } catch (error) {
      console.error('Validation error:', error.message);
      return null;
    }
  }
}

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
        (request: any) => request?.Authentication,
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload) {
    try {
      console.log(
        `Sending request to auction: ${JSON.stringify({
          exchange: USER_EXCHANGE,
          routingKey: USER_GET_USER_BY_ID_ROUTING_KEY,
          payload: {
            message: {
              id: userId,
            },
          },
        })}`,
      );
      const result = await this.amqpConnection.request({
        exchange: USER_EXCHANGE,
        routingKey: USER_GET_USER_BY_ID_ROUTING_KEY,
        payload: {
          message: {
            id: userId,
          },
        },
      });

      if (result) {
        return result;
      }

      return null;
    } catch (error) {
      console.error('Validation error:', error.message);
      return null;
    }
  }
}

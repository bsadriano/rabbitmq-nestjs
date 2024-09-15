import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {
  USER_EXCHANGE,
  USER_VALIDATE_ROUTING_KEY,
} from 'src/constants/services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly amqpConnection: AmqpConnection) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    try {
      const result = await this.amqpConnection.request({
        exchange: USER_EXCHANGE,
        routingKey: USER_VALIDATE_ROUTING_KEY,
        payload: {
          message: {
            email,
            password,
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

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { catchError, lastValueFrom, of, timeout } from 'rxjs';
import { USER_SERVICE } from 'src/constants/services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(USER_SERVICE) private rabbitClient: ClientProxy) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    try {
      const result = await lastValueFrom(
        this.rabbitClient
          .send(
            { cmd: 'validate-user' },
            {
              email,
              password,
            },
          )
          .pipe(
            timeout(5000),
            catchError((error) =>
              of<any>({ error: 'Error handled: ' + error.message }),
            ),
          ),
      );

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

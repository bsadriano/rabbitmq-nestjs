import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { catchError, lastValueFrom, of, timeout } from 'rxjs';
import { USER_SERVICE } from 'src/constants/services';
import { TokenPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(USER_SERVICE) private rabbitClient: ClientProxy,
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
      const result = await lastValueFrom(
        this.rabbitClient
          .send(
            { cmd: 'get-user-by-id' },
            {
              userId,
            },
          )
          .pipe(
            timeout(5000),
            catchError((error) => of('Error handled: ' + error.message)),
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

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { catchError, of, tap, timeout } from 'rxjs';
import { USER_SERVICE } from 'src/constants/services';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

export interface TokenPayload {
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(USER_SERVICE) private rabbitClient: ClientProxy,
  ) {}

  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const expires = new Date();
    console.log(expires.toISOString());

    expires.setSeconds(expires.getSeconds() + 3600);
    console.log(expires.toISOString());

    // console.log(
    //   expires.getSeconds(),
    //   +expires.getSeconds() + this.configService.get<number>('jwt.expiration'),
    // );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }

  createUser(createUserDto: CreateUserDto) {
    return this.rabbitClient
      .send(
        {
          cmd: 'create-user',
        },
        createUserDto,
      )
      .pipe(
        timeout(5000),
        tap((res) => {
          if (res.error) {
            if (res.error.statusCode === 400) {
              throw new BadRequestException(res.error.message);
            }
          }
        }),
      );
  }

  getUsers() {
    return this.rabbitClient.send({ cmd: 'get-users' }, {}).pipe(
      timeout(5000),
      catchError((error) => of('Error handled: ' + error.message)),
    );
  }

  getUser(id: number) {
    return this.rabbitClient.send({ cmd: 'get-user-by-id' }, { id });
  }

  validateUser(email: string, password: string) {
    return this.rabbitClient.send(
      { cmd: 'validate-user' },
      {
        email,
        password,
      },
    );
  }
}

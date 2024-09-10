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

  login(user: User) {
    const accessToken = this.generateToken(user.id);
    const refreshToken = this.generateToken(
      user.id,
      this.configService.get<number>('jwt.refresh_expiration'),
    );

    return {
      ...user,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  }

  generateToken(
    userId: number,
    offset = this.configService.get<number>('jwt.access_expiration'),
  ) {
    const tokenPayload = {
      userId,
    };

    const expires = new Date();

    expires.setSeconds(expires.getSeconds() + offset);

    const token = this.jwtService.sign(tokenPayload, {
      expiresIn: `${offset}s`,
    });

    return {
      expires,
      token,
    };
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

  refresh(token: string) {
    const { userId } = this.jwtService.decode(token);
    const accessToken = this.generateToken(userId);
    const refreshToken = this.generateToken(userId, 3600 * 24);

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  }
}

import { CurrentUser, RMQMessage } from '@bsadriano/rmq-nestjs-lib';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import {
  AUTH_CMD_VALIDATE_USER,
  AUTH_EXCHANGE,
  AUTH_SERVICE,
  USER_CREATE_ROUTING_KEY,
  USER_EXCHANGE,
  USER_GET_USER_BY_ID_ROUTING_KEY,
  USER_GET_USERS_ROUTING_KEY,
  USER_VALIDATE_ROUTING_KEY,
} from 'src/constants/services';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import JwtAuthGuard from './guards/jwt-auth.guard';

export interface TokenPayload {
  userId: number;
}

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly amqpConnection: AmqpConnection,
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
    return this.amqpConnection.request({
      exchange: USER_EXCHANGE,
      routingKey: USER_CREATE_ROUTING_KEY,
      payload: {
        message: createUserDto,
      },
    });
  }

  @RMQMessage({
    exchange: AUTH_EXCHANGE,
    service: AUTH_SERVICE,
    cmd: AUTH_CMD_VALIDATE_USER,
    type: 'rpc',
  })
  @UseGuards(JwtAuthGuard)
  handleValidateUser(@CurrentUser() user: User) {
    try {
      this.logger.verbose(`Handling validate-user: ${JSON.stringify(user)}`);

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      this.logger.verbose(
        `Error handling request: ${JSON.stringify(error.message)}`,
      );
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  validateUser(email: string, password: string) {
    return this.amqpConnection.request({
      exchange: USER_EXCHANGE,
      routingKey: USER_VALIDATE_ROUTING_KEY,
      payload: {
        message: {
          email,
          password,
        },
      },
    });
  }

  getUsers() {
    return this.amqpConnection.request({
      exchange: USER_EXCHANGE,
      routingKey: USER_GET_USERS_ROUTING_KEY,
      payload: {},
    });
  }

  getUser(id: number) {
    return this.amqpConnection.request({
      exchange: USER_EXCHANGE,
      routingKey: USER_GET_USER_BY_ID_ROUTING_KEY,
      payload: {
        message: {
          id,
        },
      },
    });
  }

  refresh(token: string) {
    const { userId } = this.jwtService.decode(token);
    const accessToken = this.generateToken(userId);
    const refreshToken = this.generateToken(
      userId,
      this.configService.get<number>('jwt.refresh_expiration'),
    );

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  }
}

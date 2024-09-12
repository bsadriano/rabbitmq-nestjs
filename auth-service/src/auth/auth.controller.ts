import { RmqService, Serialize } from '@bsadriano/rmq-nestjs-lib';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import JwtAuthGuard from './guards/jwt-auth.guard';
import LocalAuthGuard from './guards/local-auth.guard';

@Controller('api/auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Serialize(UserDto)
  async login(
    @CurrentUser() user: User | { error: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    if (user instanceof User) {
      response.send(this.authService.login(user));
    } else if ('error' in user) {
      response.send(user.error);
    } else {
      response.status(500).send('Internal Server Error');
    }
  }

  @Post('refresh-token')
  async refresh(@Body('token') token: string) {
    return this.authService.refresh(token);
  }

  @Get('users')
  async getUsers() {
    return this.authService.getUsers();
  }

  @Get('users/:id')
  async getUser(@Param('id') id: number) {
    return this.authService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate-user')
  async validateUser(@CurrentUser() user: User, @Ctx() ctx: RmqContext) {
    try {
      this.logger.verbose(`Handling validate-user`);

      return user;
    } catch (error) {
      this.logger.verbose(
        `Error handling request: ${JSON.stringify(error.response)}`,
      );
      return {
        error: error.response,
      };
    } finally {
      this.rmqService.ack(ctx);
    }
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    this.authService.logout(response);
  }
}

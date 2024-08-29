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
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import LocalAuthGuard from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from './entities/user.entity';
import { Response } from 'express';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { RmqService } from 'src/rmq/rmq.service';

@Controller('api/auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
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

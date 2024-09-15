import { Serialize } from '@bsadriano/rmq-nestjs-lib';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import LocalAuthGuard from './guards/local-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Serialize(UserDto)
  async login(
    @CurrentUser() user: User | { error: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    if ('error' in user) {
      response.send(user.error);
    } else if (!user) {
      response.status(500).send('Internal Server Error');
    } else {
      response.send(this.authService.login(user));
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

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    this.authService.logout(response);
  }
}

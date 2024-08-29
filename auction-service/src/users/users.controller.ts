import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from 'src/rmq/rmq.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  private logger = new Logger('UsersController');

  constructor(
    private readonly usersService: UsersService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'create-user' })
  async handleCreateUser(
    @Payload() data: CreateUserDto,
    @Ctx() ctx: RmqContext,
  ) {
    return this.handleRequest(async () => this.usersService.create(data), ctx);
  }

  @MessagePattern({ cmd: 'get-users' })
  async handleGetusers(_, @Ctx() ctx: RmqContext) {
    return this.handleRequest(async () => this.usersService.findAll(), ctx);
  }

  @MessagePattern({ cmd: 'get-user-by-id' })
  async handleGetUser(
    @Payload() data: { userId: number },
    @Ctx() ctx: RmqContext,
  ) {
    return this.handleRequest(
      async () => this.usersService.findOne(data.userId),
      ctx,
    );
  }

  @MessagePattern({ cmd: 'validate-user' })
  async handleValidateUser(
    @Payload() data: { email: string; password: string },
    @Ctx() ctx: RmqContext,
  ) {
    return this.handleRequest(
      async () => this.usersService.validateUser(data),
      ctx,
    );
  }

  private async handleRequest(
    action: () => Promise<any>,
    ctx: RmqContext,
  ): Promise<any | { error: any }> {
    try {
      return await action();
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

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

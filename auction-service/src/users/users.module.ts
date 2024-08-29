import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RmqModule } from 'src/rmq/rmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RmqModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

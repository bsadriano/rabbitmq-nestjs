import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.verbose(
      `Handling create user with data: "${JSON.stringify(createUserDto)}"`,
    );

    await this.validateCreateUserRequest(createUserDto);

    const user = this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    await this.userRepository.save(user);

    this.logger.verbose('Successfully created user');

    return user;
  }

  private async validateCreateUserRequest(createUserDto: CreateUserDto) {
    let user: User;
    try {
      user = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });
    } catch (error) {
      console.log(error);
    }

    if (user) {
      throw new BadRequestException('Email already exists.');
    }
  }

  async validateUser(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = await this.userRepository.findOneBy({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(getUserArgs: Partial<User>) {
    return this.userRepository.findOneBy(getUserArgs);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }

    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { LoggerService } from '../shared/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly loggerService: LoggerService,
  ) {}

  async createUser(userDto: UserDto): Promise<User> {
    const user = this.userRepository.create({...userDto, status: 0});
    return await this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const options: FindOneOptions<User> = { where: { username } };
    return await this.userRepository.findOne(options);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const options: FindOneOptions<User> = { where: { email } };
    return await this.userRepository.findOne(options);
  }

  async updateUser(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      this.loggerService.error(`Error updating user: ${error}`);
      throw new NotFoundException('User not found');
    }
  }
}
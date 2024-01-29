import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.dto';
import { LoggerService } from '../shared/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly loggerService: LoggerService,
  ) {}

  async createUser(userDto: UserDto): Promise<UserEntity> {
    const user = this.userRepository.create({...userDto, status: 0});
    return await this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<UserEntity | undefined> {
    const options: FindOneOptions<UserEntity> = { where: { username } };
    return await this.userRepository.findOne(options);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const options: FindOneOptions<UserEntity> = { where: { email } };
    return await this.userRepository.findOne(options);
  }

  async updateUser(user: UserEntity): Promise<UserEntity> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      this.loggerService.error(`Error updating user: ${error}`);
      throw new NotFoundException('User not found');
    }
  }
}
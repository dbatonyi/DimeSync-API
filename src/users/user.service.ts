import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { UserEntity, UserRole } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoggerService } from '../shared/logger/logger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly loggerService: LoggerService,
  ) {}

  async doesAdminUserExist(): Promise<boolean> {
    const adminUser = await this.userRepository.findOne({ where: { role: UserRole.Admin } });
    return !!adminUser;
  }

  async createAdminUserFromEnv(): Promise<void> {
    const adminUser = new UserEntity();
    adminUser.username = process.env.ADMIN_USERNAME || 'admin';
    adminUser.first_name = process.env.ADMIN_FIRST_NAME || 'Admin';
    adminUser.last_name = process.env.ADMIN_LAST_NAME || 'User';
    adminUser.email = process.env.ADMIN_EMAIL || 'admin@example.com';
    adminUser.status = 1;

    adminUser.role = UserRole.Admin;

    const plainPassword = process.env.ADMIN_PASSWORD || 'admin';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    adminUser.password = hashedPassword;

    await this.userRepository.save(adminUser);
  }

  async findByUserId(id: number): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }  

  async createUser(CreateUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create({...CreateUserDto, status: 0});
    return await this.userRepository.save(user);
  }

  async updateProfile(userId: number, updateDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.first_name = updateDto.first_name || user.first_name;
    user.last_name = updateDto.last_name || user.last_name;

    if (updateDto.password) {
      const hashedPassword = await bcrypt.hash(updateDto.password, 10);
      user.password = hashedPassword;
    }

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
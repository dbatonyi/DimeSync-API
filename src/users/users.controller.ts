import { Controller, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Request } from 'express';
import { UserEntity } from './user.entity';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('update-profile')
  async updateProfile(@Body() updateDto: UpdateUserDto, @Req() request: Request & { user: UserEntity }) {
    const userId = request.user.id;

    try {
      const updatedUser = await this.userService.updateProfile(userId, updateDto);
      return { message: 'Profile updated successfully', user: updatedUser };
    } catch (error) {
      return { message: 'Failed to update profile', error: error.message };
    }
  }
}

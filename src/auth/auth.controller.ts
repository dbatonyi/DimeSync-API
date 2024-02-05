import { Controller, Request, Post, UseGuards, Body, Get, Param, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.register(CreateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check-auth')
  async checkAuth(@Request() req) {
    return { message: 'User is authenticated', user: req.user };
  }

  @Get('verify/:token')
  async verify(@Param('token') token: string, @Res() res) {
    const result = await this.authService.verifyEmail(token);
    
    res.status(result.statusCode).json({ message: result.message });
  }
}

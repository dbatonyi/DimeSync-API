import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user.dto';
import { MailerService } from '../shared/mailer/mailer.service';
import * as jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly verificationTokenSecret: string = process.env.VERIFICATION_TOKEN_SECRET || 'defaultSecret';

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async register(userDto: UserDto): Promise<any> {
    const existingUser = await this.userService.findByUsername(userDto.username);

    if (existingUser) {
      return { message: 'Username is already taken' };
    }

    const existingEmailUser = await this.userService.findByEmail(userDto.email);

    if (existingEmailUser) {
      return { message: 'Email is already in use' };
    }

    const newUser = await this.userService.createUser(userDto);

    const verificationToken = this.generateVerificationToken(newUser.username);

    await this.mailerService.sendVerificationEmail(newUser.username, newUser.email, verificationToken);

    const { password, ...result } = newUser;
    return result;
  }

  private generateVerificationToken(username: string): string {
    const expiration = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
    const tokenPayload = { username, exp: expiration };
    return jwt.sign(tokenPayload, this.verificationTokenSecret);
  }

  async verifyEmail(verificationToken: string): Promise<{ statusCode: number; message: string }> {
    try {
      const decoded = jwt.verify(verificationToken, this.verificationTokenSecret) as { username: string };

      const username = decoded.username;
      const user = await this.userService.findByUsername(username);

      if (!user) {
        return { statusCode: 404, message: 'User not found' };
      }

      user.status = 1;
      await this.userService.updateUser(user);

      return { statusCode: 200, message: 'Account activated successfully' };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        console.error('Token has expired:', error);
        return { statusCode: 401, message: 'Token has expired' };
      } else {
        console.error('Token verification failed:', error);
        return { statusCode: 400, message: 'Invalid verification token' };
      }
    }
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

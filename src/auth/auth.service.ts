import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { MailerService } from '../shared/mailer/mailer.service';
import { LoggerService } from '../shared/logger/logger.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly verificationTokenSecret: string = process.env.VERIFICATION_TOKEN_SECRET || 'defaultSecret';

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly loggerService: LoggerService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async register(CreateUserDto: CreateUserDto): Promise<any> {
    try {
      const existingUser = await this.userService.findByUsername(CreateUserDto.username);

      if (existingUser) {
        return { message: 'Username is already taken' };
      }

      const existingEmailUser = await this.userService.findByEmail(CreateUserDto.email);

      if (existingEmailUser) {
        return { message: 'Email is already in use' };
      }

      const newUser = await this.userService.createUser({
        ...CreateUserDto,
        password: await bcrypt.hash(CreateUserDto.password, 10),
      });

      const verificationToken = this.generateVerificationToken(newUser.username);

      await this.mailerService.sendVerificationEmail(newUser.username, newUser.email, verificationToken);

      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      this.loggerService.error(`Error during user registration: ${error.message}`);
      throw error;
    }
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
        this.loggerService.error(`Token has expired: ${error}`);
        return { statusCode: 401, message: 'Token has expired' };
      } else {
        this.loggerService.error(`Token verification failed: ${error}`);
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

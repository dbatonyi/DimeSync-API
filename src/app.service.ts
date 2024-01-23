import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getTestService(): string {
    return 'Test Service!';
  }
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { FinancialModule } from '../financialTable/financialTable.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FinancialModule],
  providers: [UserService],
})
export class UsersModule {}

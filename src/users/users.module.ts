import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { FinancialModule } from '../financialTable/financialTable.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), FinancialModule],
  providers: [UserService],
})
export class UsersModule {}

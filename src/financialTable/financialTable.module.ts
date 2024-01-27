import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialController } from './financialTable.controller';
import { FinancialTableService } from './financialTable.service';
import { FinancialTable } from './financialTable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialTable])],
  controllers: [FinancialController],
  providers: [FinancialTableService],
})
export class FinancialModule {}
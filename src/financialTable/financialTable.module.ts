import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialController } from './financialTable.controller';
import { FinancialTableService } from './financialTable.service';
import { FinancialTableEntity } from './financialTable.entity';
import { CleanupService } from '../shared/cleanup/cleanup.service';
import { CleanupJob } from '../shared/cleanup/cleanup.job';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialTableEntity])],
  controllers: [FinancialController],
  providers: [FinancialTableService, CleanupService, CleanupJob],
})
export class FinancialModule {}
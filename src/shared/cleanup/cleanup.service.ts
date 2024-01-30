import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialTableEntity } from '../../financialTable/financialTable.entity';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    @InjectRepository(FinancialTableEntity)
    private readonly financialTableRepository: Repository<FinancialTableEntity>,
  ) {}

  async cleanupFinancialTables() {
    try {
      const financialTablesToDelete = await this.financialTableRepository.find({
        where: { status: 0 },
        relations: ['incomeGroups', 'expenseGroups'],
      });

      const deletedTableCount = financialTablesToDelete.length;

      for (const financialTable of financialTablesToDelete) {
        await this.financialTableRepository.remove(financialTable);
      }

      this.logger.log(`Financial tables cleanup successful. Deleted ${deletedTableCount} tables.`);
      return;
    } catch (error) {
      this.logger.error(`Error during financial tables cleanup: ${error.message}`, error.stack);
      throw new Error('An error occurred during financial tables cleanup.');
    }
  }
}

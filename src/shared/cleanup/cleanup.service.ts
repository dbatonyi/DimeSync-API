import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { FinancialTableEntity } from '../../financialTable/financialTable.entity';
import { UserEntity } from '../../users/user.entity';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    @InjectRepository(FinancialTableEntity)
    @InjectRepository(UserEntity)
    private readonly financialTableRepository: Repository<FinancialTableEntity>,
    private readonly userRepository: Repository<UserEntity>,
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

  async cleanupInactiveUsers() {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const inactiveUsersToDelete = await this.userRepository.find({
        where: { status: 0, created_at: MoreThan(oneWeekAgo) },
      });

      const deletedUserCount = inactiveUsersToDelete.length;

      for (const user of inactiveUsersToDelete) {
        await this.userRepository.remove(user);
      }

      this.logger.log(`User cleanup successful. Deleted ${deletedUserCount} users.`);
      return deletedUserCount;
    } catch (error) {
      this.logger.error(`Error during user cleanup: ${error.message}`, error.stack);
      throw new Error('An error occurred during user cleanup.');
    }
  }
}

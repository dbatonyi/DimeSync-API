import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { FinancialTable } from './financialTable.entity';
import { LoggerService } from '../shared/logger/logger.service';

@Injectable()
export class FinancialTableService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FinancialTable)
    private readonly financialRepository: Repository<FinancialTable>,
    private readonly loggerService: LoggerService,
  ) {}

  async createFinancialTableEntry(userId: number, amount: number): Promise<FinancialTable> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const financialEntry = new FinancialTable();
      financialEntry.amount = amount;
      financialEntry.user = user;

      return await this.financialRepository.save(financialEntry);
    } catch (error) {
      this.loggerService.error(`Error during financial entry creation: ${error.message}`);
      throw error;
    }
  }

  async deleteFinancialTableEntry(entryId: number): Promise<number> {
    try {
      const result = await this.financialRepository.delete(entryId);
      return result.affected;
    } catch (error) {
      this.loggerService.error(`Error during financial entry deletion: ${error.message}`);
      throw error;
    }
  }
}

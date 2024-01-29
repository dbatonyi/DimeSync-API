import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { FinancialTableEntity } from './financialTable.entity';
import { LoggerService } from '../shared/logger/logger.service';

@Injectable()
export class FinancialTableService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FinancialTableEntity)
    private readonly financialRepository: Repository<FinancialTableEntity>,
    private readonly loggerService: LoggerService,
  ) {}

  async createFinancialTableEntry(userId: number, amount: number): Promise<FinancialTableEntity> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const financialEntry = new FinancialTableEntity();
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

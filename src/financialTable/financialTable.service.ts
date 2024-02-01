import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { FinancialTableEntity } from './financialTable.entity';
import { LoggerService } from '../shared/logger/logger.service';
import { CreateFinancialTableDto } from './dto/createFinancialTable.dto';
import { UpdateFinancialTableDto } from './dto/updateFinancialTable.dto';

@Injectable()
export class FinancialTableService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FinancialTableEntity)
    private readonly financialRepository: Repository<FinancialTableEntity>,
    private readonly loggerService: LoggerService,
  ) {}

  async createFinancialTable(createFinancialTableDto: CreateFinancialTableDto): Promise<FinancialTableEntity> {
    try {
      const { user_id, ...restDto } = createFinancialTableDto;

      const user = await this.userRepository.findOne({ where: { id: user_id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const financialEntry = this.financialRepository.create(restDto);
      financialEntry.user = user;

      return await this.financialRepository.save(financialEntry);
    } catch (error) {
      this.loggerService.error(`Error during financial entry creation: ${error.message}`);
      throw error;
    }
  }

  async updateFinancialTableEntry(entryId: number, updateFinancialTableDto: UpdateFinancialTableDto): Promise<void> {
    try {
      const financialEntry = await this.financialRepository.findOne({ where: { id: entryId } });

      if (!financialEntry) {
        throw new NotFoundException('Financial entry not found');
      }

      if (updateFinancialTableDto.financial_table_name) {
        financialEntry.financial_table_name = updateFinancialTableDto.financial_table_name;
      }
      if (updateFinancialTableDto.weight !== undefined) {
        financialEntry.weight = updateFinancialTableDto.weight;
      }
      if (updateFinancialTableDto.currency) {
        financialEntry.currency = updateFinancialTableDto.currency;
      }

      await this.financialRepository.save(financialEntry);
    } catch (error) {
      this.loggerService.error(`Error during financial entry update: ${error.message}`);
      throw error;
    }
  }

  async deleteFinancialTableEntry(entryId: number): Promise<number> {
    try {
      const financialEntry = await this.financialRepository.findOne({ where: { id: entryId } });

      if (!financialEntry) {
        throw new NotFoundException('Financial entry not found');
      }

      financialEntry.status = 0;
      await this.financialRepository.save(financialEntry);

      return;
    } catch (error) {
      this.loggerService.error(`Error during financial entry deletion: ${error.message}`);
      throw error;
    }
  }
}

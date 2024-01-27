import { Controller, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { FinancialTableService } from './financialTable.service';
import { FinancialTableCreateDto } from './dto/financialTableCreate.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('financial-table')
@UseGuards(AuthGuard('jwt'))
export class FinancialController {
  constructor(private readonly financialTableService: FinancialTableService) {}

  @Post('create')
  async createFinancialEntry(
    @Body() createDto: FinancialTableCreateDto,
  ) {
    const userId = createDto.userId;
    const financialEntry = await this.financialTableService.createFinancialTableEntry(userId, createDto.amount);
    return { financialEntry };
  }

  @Delete('delete')
  async deleteFinancialEntry(@Body('entryId') entryId: number) {
    const result = await this.financialTableService.deleteFinancialTableEntry(entryId);

    if (result === 0) {
      return { message: 'Financial entry not found' };
    }

    return { message: 'Financial entry deleted successfully' };
  }
}

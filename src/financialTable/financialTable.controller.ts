import { Controller, Post, Body, Delete, Put, UseGuards, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { FinancialTableService } from './financialTable.service';
import { CreateFinancialTableDto } from './dto/createFinancialTable.dto';
import { UpdateFinancialTableDto } from './dto/updateFinancialTable.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('financial-table')
@UseGuards(AuthGuard('jwt'))
export class FinancialController {
  constructor(private readonly financialTableService: FinancialTableService) {}

  @Post('create')
  async createFinancialEntry(
    @Body() createDto: CreateFinancialTableDto,
  ) {
    try {
      const financialEntry = await this.financialTableService.createFinancialTable(createDto);
      return { status: 201, data: { financialEntry } };
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, error: 'Failed to create financial entry' };
    }
  }

  @Put('update/:entryId')
  async updateFinancialEntry(
    @Body() updateDto: UpdateFinancialTableDto,
    @Param('entryId') entryId: number,
  ) {
    try {
      await this.financialTableService.updateFinancialTableEntry(entryId, updateDto);
      return { status: 200, message: 'Financial entry updated successfully' };
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, error: 'Failed to update financial entry' };
    }
  }

  @Delete('delete/:entryId')
  async deleteFinancialEntry(@Param('entryId') entryId: number) {
    try {
      const result = await this.financialTableService.deleteFinancialTableEntry(entryId);

      if (result === 0) {
        return { status: HttpStatus.NOT_FOUND, error: 'Financial entry not found' };
      }

      return { status: 200, message: 'Financial entry deleted successfully' };
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, error: 'Failed to delete financial entry' };
    }
  }
}

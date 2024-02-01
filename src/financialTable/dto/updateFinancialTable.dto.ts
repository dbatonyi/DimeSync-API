import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateFinancialTableDto {
  @IsOptional()
  @IsNotEmpty()
  financial_table_name?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNotEmpty()
  currency?: string;

}

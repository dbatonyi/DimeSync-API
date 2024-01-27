import { IsNumber, IsNotEmpty } from 'class-validator';

export class FinancialTableCreateDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

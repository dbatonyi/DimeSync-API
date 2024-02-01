import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateFinancialTableDto {

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  financial_table_name: string;

  @IsNumber()
  @IsNotEmpty()
  weight: number = 1;

  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @IsNotEmpty()
  status: number = 1;

}

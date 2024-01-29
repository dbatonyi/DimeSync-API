import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { FinancialTableEntity } from '../financialTable/financialTable.entity';
import { IncomeEntity } from '../income/income.entity';

@Entity('income_groups')
export class IncomeGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_name: string;

  @Column()
  weight: number;

  // Many IncomeGroups can be associated with one FinancialTable
  @ManyToOne(() => FinancialTableEntity, financialTable => financialTable.incomeGroups)
  financialTable: FinancialTableEntity;

  // One IncomeGroup can have many Incomes
  @OneToMany(() => IncomeEntity, income => income.incomeGroup)
  incomes: IncomeEntity[];
}

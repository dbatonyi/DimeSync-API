import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { FinancialTableEntity } from '../financialTable/financialTable.entity';
import { ExpenseEntity } from '../expense/expense.entity';

@Entity('expense_groups')
export class ExpenseGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_name: string;

  @Column()
  weight: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Many ExpenseGroups can be associated with one FinancialTable
  @ManyToOne(() => FinancialTableEntity, financialTable => financialTable.expenseGroups)
  financialTable: FinancialTableEntity;

  // One ExpenseGroup can have many Expenses
  @OneToMany(() => ExpenseEntity, expense => expense.expenseGroup)
  expenses: ExpenseEntity[];
}

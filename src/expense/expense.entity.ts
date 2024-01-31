import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ExpenseGroupEntity } from '../expenseGroup/expenseGroup.entity';

@Entity('expenses')
export class ExpenseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expense_name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  expense_category: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Many Expenses can be associated with one ExpenseGroup
  @ManyToOne(() => ExpenseGroupEntity, expenseGroup => expenseGroup.expenses)
  @JoinColumn({ name: 'expense_group_id' })
  expenseGroup: ExpenseGroupEntity;
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity'
import { ExpenseGroupEntity } from '../expenseGroup/expenseGroup.entity';
import { IncomeGroupEntity } from '../incomeGroup/incomeGroup.entity';

@Entity('financial_tables')
export class FinancialTableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  financial_table_name: string;

  @Column()
  weight: number;

  @Column()
  status: number;

  @Column()
  currency: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Many FinancialTables can be associated with one User
  @ManyToOne(() => UserEntity, user => user.financialTables)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // One FinancialTable can have many ExpenseGroups
  @OneToMany(() => ExpenseGroupEntity, expenseGroup => expenseGroup.financialTable)
  expenseGroups: ExpenseGroupEntity[];

  // One FinancialTable can have many IncomeGroups
  @OneToMany(() => IncomeGroupEntity, incomeGroup => incomeGroup.financialTable)
  incomeGroups: IncomeGroupEntity[];
}

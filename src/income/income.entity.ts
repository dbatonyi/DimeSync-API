import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IncomeGroupEntity } from '../incomeGroup/incomeGroup.entity';

@Entity('incomes')
export class IncomeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  income_name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  income_category: string;

  // Many Incomes can be associated with one IncomeGroup
  @ManyToOne(() => IncomeGroupEntity, incomeGroup => incomeGroup.incomes)
  @JoinColumn({ name: 'income_group_id' })
  incomeGroup: IncomeGroupEntity;
}

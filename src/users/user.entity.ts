import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FinancialTable } from '../financialTable/financialTable.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: 0 })
  status: number;

  @OneToMany(() => FinancialTable, financialTable => financialTable.user)
  financialTables: FinancialTable[];
}

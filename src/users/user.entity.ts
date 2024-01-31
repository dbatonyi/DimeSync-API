import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { FinancialTableEntity } from '../financialTable/financialTable.entity';

enum UserRole {
  Admin = 'admin',
  Premium = 'premium',
  User = 'user',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  status: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // One User can have many FinancialTables
  @OneToMany(() => FinancialTableEntity, financialTable => financialTable.user)
  financialTables: FinancialTableEntity[];
}

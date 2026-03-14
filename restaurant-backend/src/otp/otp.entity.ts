import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('otp_codes')
export class OtpCode {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  otp: string;

  @Column()
  expiresAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
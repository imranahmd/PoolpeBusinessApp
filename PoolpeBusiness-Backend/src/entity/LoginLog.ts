import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class LoginLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  apiEndpoint: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @CreateDateColumn()
  timestamp: Date;
}

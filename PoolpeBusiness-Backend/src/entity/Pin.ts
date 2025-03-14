import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Pin {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ length: 255 , nullable: true})
  password: string;

  @Column({ length: 255 , nullable: true})
  oldPassword: string;

  @Column({ length: 20 })
  mobileNumber: string;

  @Column({ length: 30 })
  emailId: string;

  @Column()
  isapproved: boolean;

  @Column()
  isregistered: boolean;

  @Column()
  isQrGenrated: boolean;

  @Column({ type: 'int', nullable: true })
  AgentID: number | null;

  @Column({ length: 255, nullable: true })
  AgentName: string | null;

  @Column({ type: 'tinyint', default: false })
  passwordCreated: boolean;


  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @UpdateDateColumn()
  registeredDate: Date;

  @Column()
  isLoggedIn: boolean;

  @Column({ length: 255, nullable: true })
  token: string | null;
}

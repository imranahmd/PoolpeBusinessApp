import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserActivity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    mobileNumber: string;

    @Column()
    serviceName: string;

    @Column({ type: 'timestamp' })
    timestamp: Date;
}

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class TransactionBackup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 15 })
    mobileNumber: string;

    @Column({ type: "varchar", length: 255 })
    businessName: string;

    @Column({ type: "varchar", length: 255 })
    emailId: string;

    @Column({ type: "timestamp" })
    txnTime: Date;

    @Column({ type: "varchar", length: 255 })
    transactionUTR: string;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    amount: number;

    @Column({ type: "varchar", length: 255 })
    paymentOriginatedFrom: string;

    @Column({ type: "varchar", length: 255 })
    transactionId: string;

    @Column({ type: "varchar", length: 255 })
    utrNumber: string;
}

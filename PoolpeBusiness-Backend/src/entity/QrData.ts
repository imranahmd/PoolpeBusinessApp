import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class QrData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sellerIdentifier: string;

    @Column()
    qrString: string;
}
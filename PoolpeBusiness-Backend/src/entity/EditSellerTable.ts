import { Entity, CreateDateColumn, Column, PrimaryColumn } from "typeorm";

@Entity()
export class EditSellerTable {

    @PrimaryColumn({type: "varchar", length: 45})
    requestId: string;

    @Column({ type: "varchar", length: 255 })
    responseMessage: string;

    @Column({ type: "varchar", length: 45 })
    status: string;

    @Column({ type: "varchar", length: 45 })
    responseCode: string;

    @Column({ type: "varchar", length: 255 })
    sellerIdentifier: string;

    @CreateDateColumn()
    date: Date;

}
import { Col } from "sequelize/types/utils";
import { Entity, Column, PrimaryColumn } from "typeorm";

export class QrResponse{
     
    // @Column({ type: "int" })
    // code: number;

    // @Column({type: "varchar", length:1000})
    // msg: string;

    // @Column({type: "varchar", length:500})
    // status: string;

    // @Column({type: "varchar", length:500})
    // sellerStatus: string;

    // @Column({type: "varchar", length:500})
    // qrString: string;

    // @Column({type: "varchar", length:500})
    // sellerIdentifier: string;

    // @Column({type: "varchar", length:500})
    // responseCode: string;

    // @Column({type: "varchar", length:500})
    // responseMessage: string;

    code: number;
    msg: string;
    status: string;
    sellerStatus: string;
    qrString: string;
    sellerIdentifier: string;

    constructor(
        code: number, 
        msg: string, 
        status: string, 
        sellerStatus: string, 
        qrString: string, 
        sellerIdentifier: string
    ) {
        this.code = code;
        this.msg = msg;
        this.status = status;
        this.sellerStatus = sellerStatus;
        this.qrString = qrString;
        this.sellerIdentifier = sellerIdentifier;
    }


    
}
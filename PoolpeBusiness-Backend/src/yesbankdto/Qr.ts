    import { Col } from "sequelize/types/utils";
    import { Entity, Column, PrimaryColumn } from "typeorm";

    export class Qr{

        @PrimaryColumn()
        @Column({type: "varchar", length: 255})
        SellerIdentifier: string;

        
        @Column({type: "varchar", length:1500})
        hash: string;

        constructor(){

        }

    }
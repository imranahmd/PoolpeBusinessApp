import { Col } from "sequelize/types/utils";
import { Entity, Column, PrimaryColumn } from "typeorm";

export class FundSettle{
   
    sellerIdentifier: string;
    txnId: string;
    status:string;
    amount:number;
    txntime:string;
    responseMessage:string;

    
    constructor() {
        
    }

}
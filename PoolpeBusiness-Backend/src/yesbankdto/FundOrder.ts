import { Col } from "sequelize/types/utils";
import { Entity, Column, PrimaryColumn } from "typeorm";

export class FundOrder{

    amount:number;
    responseMessage: string;
    sellerIdentifier: string;
    status:number;
    txnId:string;
    txnTime:string;


    constructor(){
    }

}
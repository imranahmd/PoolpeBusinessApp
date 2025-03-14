import { Col } from "sequelize/types/utils";
import { Entity, Column, PrimaryColumn } from "typeorm";

export class SellerResponse{
     
    code: number;
    msg: string;
    status: string;
    sellerIdentifier: string;
    responseCode: string;
    responseMessage: string;

    // constructor(){
        
    // }
    constructor(
        code: number,
        msg: string,
        status: string,
        sellerIdentifier: string,
        responseCode: string,
        responseMessage: string
    ) {
        this.code = code;
        this.msg = msg;
        this.status = status;
        this.sellerIdentifier = sellerIdentifier;
        this.responseCode = responseCode;
        this.responseMessage = responseMessage;
    }
}
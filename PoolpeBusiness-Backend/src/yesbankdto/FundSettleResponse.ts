import { Col } from "sequelize/types/utils";
import { Entity, Column, PrimaryColumn } from "typeorm";
import { FundSettle } from "./FundSettle";


export class FundSettleResponse{
     
    code:number;
    pageSize: number;
    resultCount:number;
    start: number;
    total: number;
    fundSettleList: FundSettle[];
    msg: string;

    constructor(
        pageSize: number,
        fundSettleList:[FundSettle],
        resultCount: number,
        start: number,
        total: number,
        code: number,
        msg: string
    ) {
        this.pageSize = pageSize;
        this.fundSettleList= fundSettleList;
        this.resultCount = resultCount;
        this.start = start;
        this.total = total;
        this.code = code;
        this.msg = msg;
    }
    
}
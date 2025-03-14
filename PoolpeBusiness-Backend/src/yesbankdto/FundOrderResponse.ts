import { Col } from "sequelize/types/utils";
import { Entity, Column, PrimaryColumn } from "typeorm";
import { FundOrder } from "./FundOrder";

export class FundOrderResponse{
    code: number;
    pageSize: number;
    resultCount:number;
    start: number;
    total: number;
    fundOrderList: FundOrder[];
    msg: string;

    constructor(
        pageSize: number,
        // fundOrderList: [FundOrder],
        fundOrderList: FundOrder[], 
        resultCount: number,
        start: number,
        total: number,
        code: number,
        msg: string
    ) {
        this.pageSize = pageSize;
        this.fundOrderList=fundOrderList;
        this.resultCount = resultCount;
        this.start = start;
        this.total = total;
        this.code = code;
        this.msg = msg;
    }

}
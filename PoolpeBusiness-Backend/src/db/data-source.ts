import "reflect-metadata"
import { DataSource } from "typeorm"
import { Users } from "../entity/Users"
import { Photo } from "../entity/Photo";
import {EditSellerTable} from "../entity/EditSellerTable";
import { TransactionBackup } from "../entity/TransactionBackup";
import { Pin } from "../entity/Pin";
import { QrData } from "../entity/QrData";
import {UserActivity} from "../entity/UserActivity";
import {LoginLog} from "../entity/LoginLog";
// import { DailyTransactionSummary } from "../entity/DailyTransactionSummary";


const DB_PORT = parseInt(process.env.DB_PORT); 

require('dotenv').config();
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    // port: 3306,
    port: DB_PORT,
    //7042
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // synchronize: true,
    logging: false,
    entities: [Users,Photo,Pin,QrData,UserActivity,EditSellerTable,LoginLog,TransactionBackup],
    migrations: [],
    subscribers: [],
});

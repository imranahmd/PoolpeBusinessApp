import { AppDataSource } from "../db/data-source"
import { Request, Response } from "express";

import { FundSettle } from "../yesbankdto/FundSettle";
import { SellerResponse } from "../yesbankdto/SellerResponse";
import { FundSettleResponse } from "../yesbankdto/FundSettleResponse";
import {Users} from "../entity/Users"
import SellerHash from "../utilities/sellerHash";
import axios from "axios";
const qs = require('qs');
const winston = require('winston');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/fundSettle.log' }),
    new winston.transports.Console()
  ]
});

class FundSettleController{

    static formatDateTime(date:Date): String {
       
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = "00";
        const minutes = "00";
        const seconds = "00";
      
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    static toIST(date: Date): Date {
        const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // IST is UTC + 5:30
        return new Date(date.getTime() + istOffset);
    }

    static getCurrentDateTimeUTC(): Date {
        return new Date();
    }
       
     static createFundSettle = async (req: Request, res: Response) => {
       
        const { mobileNumber } = req.body;

        const currentDate = FundSettleController.getCurrentDateTimeUTC();

        // Subtract 2 months
        currentDate.setMonth(currentDate.getMonth() - 2);

        // Subtract 1 day
        currentDate.setDate(currentDate.getDate() + 1);

        const startTime = FundSettleController.formatDateTime(
            FundSettleController.toIST(new Date(currentDate.setHours(0, 0, 0, 0)))
        );

        const endTime = FundSettleController.formatDateTime(
            FundSettleController.toIST(new Date(FundSettleController.getCurrentDateTimeUTC().setHours(23, 59, 59, 999)))
        );

        logger.info("Initiating fund settlement request", { mobileNumber, startTime, endTime });

        try {
            const userRepository = AppDataSource.getRepository(Users);
            const user = await userRepository.findOne({ where: { mobileNumber:mobileNumber} });

            if (!user) {
                logger.warn("User not found", { mobileNumber });
                return res.status(404).json({ message: "User not found" });
              }

            const data = {
            sellerIdentifier:(await user).sellerIdentifier, 
            startTime: startTime,
            endTime: endTime,
            page: 0,
            apiKey: "c15ee1ba106bbb15701212e8b0d5205b",
            salt: 'x11I10gRojenIsygXxl5a2yW8l111bGn',
            hash:""
        }

            let hashed = SellerHash.sellerHash(data,["sellerIdentifier","startTime","endTime","page","apiKey"],["salt"]);

            data.hash = hashed;
            qs.stringify(data);

            logger.info("Data after hashing", { data });
          
      
        const response = await axios.post("https://payes.payfi.co.in/payes/offline/settleList", data, {
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
               'Connection': 'keep-alive'
            },
        });


        
            if (response) {
                
                const intResponse = response.data;
                const mainResponse = intResponse;

                const fundSettleResponse = new FundSettleResponse(
                    mainResponse.pageSize,
                    mainResponse.data,
                    mainResponse.resultCount,
                    mainResponse.start,
                    mainResponse.total,
                    mainResponse.code,
                    mainResponse.msg
                    
                );  
                
                logger.info("Fund settlement successful", { fundSettleResponse });

                return res.status(201).json({ status: 201, message: "Fund Settlement successful", data:fundSettleResponse  });
            } else {
                logger.warn("Error during fund settlement", { response });
                return res.status(400).json({ status: 400, message: "Error during fund settlement" });
            }
        } catch (error) {
            logger.error("Error during fund settlement", { error });
            return res.status(500).json({ error: 1, message: "Error during fund settlement" });
        }
    };
}
 module.exports = FundSettleController;

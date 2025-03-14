import { AppDataSource } from "../db/data-source"
import { Request, Response } from "express";

import { Seller } from "../yesbankdto/Seller";
import { FundOrder } from "../yesbankdto/FundOrder";
import {FundOrderResponse} from "../yesbankdto/FundOrderResponse";
import {Users} from "../entity/Users"

import SellerHash from "../utilities/sellerHash";
import axios from "axios";
import { start } from "repl";
const qs = require('qs');
const winston = require('winston');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/fundOrder.log' }),
    new winston.transports.Console()
  ]
});

class FundOrderController{

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


static createFundOrder = async (req: Request, res: Response): Promise<Response> => {
    const { mobileNumber } = req.body;
    const currentDate = FundOrderController.getCurrentDateTimeUTC();
    
    // Subtract 2 months and 1 day as per your logic
    currentDate.setMonth(currentDate.getMonth() - 2);
    currentDate.setDate(currentDate.getDate() + 1);

    const startTime = FundOrderController.formatDateTime(
      FundOrderController.toIST(new Date(currentDate.setHours(0, 0, 0, 0)))
    );
    const endTime = FundOrderController.formatDateTime(
      FundOrderController.toIST(new Date(FundOrderController.getCurrentDateTimeUTC().setHours(23, 59, 59, 999)))
    );

    logger.info("Initiating fund order request", { mobileNumber, startTime, endTime });

    try {
      const userRepository = AppDataSource.getRepository(Users);
      const user = await userRepository.findOne({ where: { mobileNumber } });

      if (!user) {
        logger.warn("User not found", { mobileNumber });
        return res.status(404).json({ message: "User not found" });
      }

      const data = {
        sellerIdentifier: (await user).sellerIdentifier,
        startTime,
        endTime,
        page: 0, // Start from the first page
        apiKey: "c15ee1ba106bbb15701212e8b0d5205b",
        salt: 'x11I10gRojenIsygXxl5a2yW8l111bGn',
        hash: ""
      };

      let allTransactions = [];
      let totalPages: number;
      let currentPage = 0;
      let pageSize: number;

      do {
        data.page = currentPage;
        let hashed = SellerHash.sellerHash(data, ["sellerIdentifier", "startTime", "endTime", "page", "apiKey"], ["salt"]);
        data.hash = hashed;
        qs.stringify(data);

        const response = await axios.post("https://payes.payfi.co.in/payes/offline/orderList", data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Connection': 'keep-alive'
          },
        });

        if (response && response.data) {
          const intResponse = response.data;
          pageSize = intResponse.pageSize;
          totalPages = Math.ceil(intResponse.resultCount / pageSize);

          // Append transactions from this page to the main list
          allTransactions = allTransactions.concat(intResponse.data);
          logger.info("Fetched transactions for page", { currentPage, totalPages });

          currentPage++;
        } else {
          logger.warn("Error while fetching fund orders", { response });
          return res.status(400).json({ status: 400, message: "Error while fetching fund orders" });
        }
      } while (currentPage < totalPages);

      const fundOrderResponse = new FundOrderResponse(
        pageSize,
        allTransactions,
        allTransactions.length,
        1,
        totalPages,
        200,
        'success'
      );

      logger.info("Fund order created successfully", { fundOrderResponse }); 


      const currentDateStr = new Date().toISOString().split('T')[0];

      // Filter transactions for the current date
      const currentDateTransactions = fundOrderResponse.fundOrderList.filter(order => order.txnTime.startsWith(currentDateStr));

      // Sum the amounts for the current date
      const totalAmountForCurrentDate = currentDateTransactions.reduce((sum, order) => sum + order.amount, 0);

      // Count the number of transactions for the current date
      const numberOfTransactionsForCurrentDate = currentDateTransactions.length;

      return res.status(201).json({
        status: 201,
        message: "Fund order initiated successfully",
        data: fundOrderResponse,
        totalAmountForCurrentDate,
        numberOfTransactionsForCurrentDate
      });

    } catch (error) {
      logger.error("Error in FundOrder request", { error });
      return res.status(500).json({ error: 1, message: "Error in sending FundOrder Request" });
    }
  }
}

module.exports = FundOrderController;

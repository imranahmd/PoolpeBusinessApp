import { Request, Response } from "express";
import { AppDataSource } from "../db/data-source";
import { Users } from "../entity/Users"
import SellerHash from "../utilities/sellerHash";
import axios, { AxiosError } from "axios";
import { EditSellerResponse } from "../yesbankdto/EditSellerResponse";
import { EditSeller } from "../yesbankdto/EditSeller";
import {EditSellerTable } from "../entity/EditSellerTable";
import { clear } from "console";
import { CLIENT_RENEG_LIMIT } from "tls";

const qs = require('qs');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/EditSellerController.log' }),
    new winston.transports.Console()
  ]
});

class EditSellerController {

    static editSeller = async (req: Request, res: Response): Promise<Response> => {
        const { mobileNumber,emailId,
            turnoverType,pan,gstNumber,newSettlementAccountNumber,
            newSettlementIFSC, businessName , mcc , 
            addressLine1 , addressLine2,
            websiteUrl 
         } = req.body;

         logger.info("Received editSeller request", { requestBody: req.body });

        try {
            const userRepository = AppDataSource.getRepository(Users);
            //const editSellerRepository = AppDataSource.getRepository(EditSellerTable);
            const user = await userRepository.findOne({ where: { mobileNumber } });

            if (!user) {
                logger.warn("User not found", { mobileNumber });
                return res.status(404).json({ message: "User not found" });
            }

            if (mobileNumber !== undefined) user.mobileNumber = mobileNumber;
            if (emailId !== undefined) user.emailId = emailId;
            if (turnoverType !== undefined) user.turnoverType = turnoverType;
            if (pan !== undefined && user.pan==="") user.pan = pan;
            if (gstNumber !== undefined) user.gstNumber = gstNumber;
            if (newSettlementAccountNumber!==undefined) user.settlementAccountNumber = newSettlementAccountNumber;
            if (newSettlementIFSC!==undefined) user.settlementIFSC = newSettlementIFSC;
            if (businessName!==undefined) user.businessname= businessName;
            if (mcc!==undefined) user.mcc = mcc;
            if (addressLine1 !== undefined && user.addressLine1==="") user.addressLine1 = addressLine1;
            if (addressLine2 !== undefined && user.addressLine2==="") user.addressLine2 = addressLine2;
           // if (websiteUrl !== undefined ) websiteUrl = websiteUrl;

            const data = {
                businessname: user.businessname,
                sellerIdentifier: user.sellerIdentifier,
                mobileNumber: user.mobileNumber,
                emailId: user.emailId,
                mcc: user.mcc,
                turnoverType: user.turnoverType,
                sellerStatus: "ACTIVE",
                pan: user.pan,
                gstNumber: user.gstNumber,
                //addressLine1:"",
                addressLine2:"",
                newSettlementAccountNumber: user.settlementAccountNumber,
                newSettlementIFSC: user.settlementIFSC,
                websiteUrl: (websiteUrl !== undefined )? websiteUrl:"",
                apiKey: "c15ee1ba106bbb15701212e8b0d5205b",
                salt: 'x11I10gRojenIsygXxl5a2yW8l111bGn',
                hash: ""
            }

            let hashed = SellerHash.sellerHash(data,
                                               ["businessname","sellerIdentifier","mobileNumber","emailId",
                                                "mcc","turnoverType",
                                               //"addressLine1",
                                               "addressLine2",
                                               "websiteUrl",
                                               "sellerStatus","pan","gstNumber",
                                               "newSettlementAccountNumber","newSettlementIFSC",
                                               "apiKey"
                                               ],
                                                ["salt"]);
            data.hash = hashed;
            logger.info("Hashed data for editSeller", { hashedData: data });
            qs.stringify(data);

          logger.info("stringify data for editSeller", { stringifyData: qs.stringify(data) });

    const response = await axios.post("https://payes.payfi.co.in/payes/seller/edit",
        qs.stringify(data), // Ensure data is properly URL-encoded
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Connection': 'keep-alive'
            }
        }
    );

            if(response && response.data){
                logger.info("Successful response.data from Yes Bank", { response: response.data });
               logger.info("Successful response from Yes Bank", { response: response });

    let editSellerResponse: EditSellerResponse = new EditSellerResponse(
        response.data.code,
        response.data.data,
        response.data.msg  
    );
    
    logger.info("User updated successfully after Yes Bank edit", { user });
            await userRepository.save(user);
            //let editSeller : EditSellerTable = response.data.data;
            //editSeller.date=new Date();
            // let editSellerR : EditSellerTable  = await editSellerRepository.save(response.data.data);
            // console.log("Edit Seller logs from yes bank", editSellerR);
            console.log("User Details from DB after successful edit seller",user);

              return res.status(200).json({
                status: 200,
                message: "Merchant edited successfully",
                data: editSellerResponse, 
              });

            }else{
                logger.warn("Error in editing merchant", { response });
                return res.status(400).json({status:400,message:"Error in editing merchant"});
            } 
        } catch (error) {
            logger.error("Error in editSeller request", { error });
        
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const responseData = axiosError.response?.data;
                const responseStatus = axiosError.response?.status;
        
                return res.status(responseStatus || 500).json({
                    error: 1,
                    message: "Error in editing seller",
                    details: responseData
                });
            }
        
            return res.status(500).json({ error: 1, message: "Error in editing seller" });
        }
    }
}
module.exports = EditSellerController;

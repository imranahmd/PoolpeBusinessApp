import { AppDataSource } from "../db/data-source";
import { Request, Response } from "express";

import SellerHash from "../utilities/sellerHash";
import { QrResponse } from "../yesbankdto/QrResponse";
import { Users } from "../entity/Users";
import { QrData } from "../entity/QrData";
import axios from "axios";
import { Pin } from "../entity/Pin";
const qs = require('qs');
const winston = require('winston');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/qr-generation.log' }),
    new winston.transports.Console()
  ]
});

class QrController {

    static createQr = async (req: Request, res: Response) => {

        const { mobileNumber } = req.body;

        try {
            const userRepository = AppDataSource.getRepository(Users);
            const user = await userRepository.findOne({ where: { mobileNumber:mobileNumber} });

            if (!user) {
                logger.warn("User not found", { mobileNumber });
                return res.status(404).json({ message: "User not found" });
              }

            const data = {
                sellerIdentifier: (await user).sellerIdentifier,
                apiKey: "c15ee1ba106bbb15701212e8b0d5205b",
                salt: 'x11I10gRojenIsygXxl5a2yW8l111bGn',
                hash: "",
  
                isQrGenrated: false // Initialize the flag
            }

            
            let hashed = SellerHash.sellerHash(data, ["sellerIdentifier", "apiKey"], ["salt"]);
            data.hash = hashed;
            qs.stringify(data);

            logger.info("Sending QR generation request", { mobileNumber,data });

            const response = await axios.post("https://payes.payfi.co.in/payes/offline/fetchqr", data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            });

            if (response) {
                
            
                const intResponse = response.data;
                const mainResponse = intResponse;

                const qrResponse = new QrResponse(
                    mainResponse.code,
                    mainResponse.msg,
                    mainResponse.data.status,
                    mainResponse.data.sellerStatus,
                    mainResponse.data.qrString,
                    mainResponse.data.sellerIdentifier
                );

                // saving qr string and sellerIdentifier in the db
                const qrData = new QrData();
                qrData.sellerIdentifier = qrResponse.sellerIdentifier;
                qrData.qrString = qrResponse.qrString;
                await AppDataSource.getRepository(QrData).save(qrData);

                var QrFlag =false ;

                // Update the flag upon successful QR generation
                if (mainResponse && mainResponse.code === 200) {
                    const pinRepository = AppDataSource.getRepository(Pin);
                    const pin = await pinRepository.findOne({ where: { mobileNumber: mobileNumber } });
                    pin.isQrGenrated=true;
                    await pinRepository.save(pin);
                    QrFlag = true;
                }

                logger.info("QR generated successfully", { mobileNumber, qrResponse });

                return res.status(201).json({ status: 201, message: "QR generated successfully", data: qrResponse , isQrGenrated: QrFlag});
            } else {
                logger.warn("QR generation failed", { mobileNumber });
                return res.status(400).json({ status: 400, message: "Error while creating QR" });
            }

        } catch (error) {
            logger.error("Error in QR generation", { error, mobileNumber });
            return res.status(500).json({ error: 1, message: "Error in creating QR" });
        }
    }
}
module.exports = QrController;

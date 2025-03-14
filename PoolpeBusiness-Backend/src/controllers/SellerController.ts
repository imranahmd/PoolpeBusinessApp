import { AppDataSource } from "../db/data-source";
import { Request, Response } from "express";
import { Seller } from "../yesbankdto/Seller";
import { SellerResponse } from "../yesbankdto/SellerResponse";
import { Users } from "../entity/Users";
import SellerHash from "../utilities/sellerHash";
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
    new winston.transports.File({ filename: 'logs/sellerController.log' }),
    new winston.transports.Console()
  ]
});

class SellerController {

    static handleApiResponse(responseCode) {
        let message = "";
        switch (responseCode) {
            case "00":
                message = "Seller has been added successfully";
                break;
            case "P001":
                message = "Invalid Partner Key";
                break;
            case "P002":
                message = "Partner is inactive";
                break;
            case "P005":
                message = "API access not given";
                break;
            case "P006":
                message = "Parameter Missing (if mandatory parameter is missing or conditional parameter is missing based on given condition)";
                break;
            case "PS001":
                message = "Unable to add seller, please try again later";
                break;
            case "PS002":
                message = "Invalid Partner Reference Number";
                break;
            case "PS003":
                message = "Duplicate Partner Reference Number (Seller details along with creation date to be given in response)";
                break;
            case "PS004":
                message = "Invalid Seller Identifier";
                break;
            case "PS005":
                message = "Seller Identifier already taken";
                break;
            case "PS006":
                message = "Invalid Mobile Number";
                break;
            case "PS007":
                message = "Seller with given mobile number already exists";
                break;
            case "PS008":
                message = "Invalid Email Id";
                break;
            case "PS009":
                message = "Seller with given email id already exists";
                break;
            case "PS010":
                message = "Invalid MCC";
                break;
            case "PS011":
                message = "Invalid Turnover Type";
                break;
            case "PS012":
                message = "Invalid Acceptance Type";
                break;
            case "PS013":
                message = "Invalid Ownership Type";
                break;
            case "PS014":
                message = "Invalid Pincode";
                break;
            case "PS015":
                message = "Invalid PAN";
                break;
            case "PS016":
                message = "Seller with given PAN already exists";
                break;
            case "PS017":
                message = "Settlement account name doesn’t match with PAN details";
                break;
            case "PS018":
                message = "Invalid GST Number";
                break;
            case "PS019":
                message = "Invalid Settlement Account Number";
                break;
            case "PS020":
                message = "Settlement Account verified name doesn’t match with seller details";
                break;
            case "PS021":
                message = "Invalid Settlement Account IFSC";
                break;
            case "PS022":
                message = "Seller settlement account verification failed";
                break;
            case "PS023":
                message = "Timeout during settlement account verification";
                break;
            case "PS054":
                message = "Seller with given settlement account number already exists";
                break;
            case "PS055":
                message = "Invalid State Code";
                break;
            case "PS057":
                message = "Invalid Business Name";
                break;
            case "PS071":
                message = "Invalid latitude format";
                break;
            case "PS072":
                message = "Invalid longitude format";
                break;
            case "PS073":
                message = "GST is not active";
                break;
            case "PS102":
                message = "Invalid LLP IN/CIN";
                break;
            case "PS103":
                message = "Timeout during LLP IN/CIN verification";
                break;
            case "PS104":
                message = "Settlement Account Name not matching with LLP IN/CIN details";
                break;
            case "PS105":
                message = "Invalid Udyog Aadhaar Number";
                break;
            case "PS106":
                message = "Timeout during Udyog Aadhaar verification";
                break;
            case "PS107":
                message = "Settlement Account Name not matching with Udyog Aadhaar details";
                break;
            case "PS108":
                message = "Invalid Electricity Bill Number";
                break;
            case "PS109":
                message = "Timeout during Electricity Bill verification";
                break;
            case "PS110":
                message = "Settlement Account Name mismatch with Electricity Bill details";
                break;
            case "PS111":
                message = "Invalid Electricity Board Code";
                break;
            case "PS112":
                message = "Invalid DOB";
                break;
            case "PS113":
                message = "Invalid DOI";
                break;
            case "PS114":
                message = "Invalid website url/application package name";
                break;
            case "PS115":
                message = "Invalid address line 1";
                break;
            case "PS116":
                message = "Invalid address line 2";
                break;
            case "PS137":
                message = "Difference between today’s date and DOB cannot be less than 18 years";
                break;
            case "PS142":
                message = "Only one of p15, p23 and p24 is allowed for seller belonging to given acceptance type and ownership type";
                break;
            case "PS144":
                message = "Sellers with this acceptance type not allowed";
                break;
            default:
                message = "Unknown error occurred";
        }
        return message;
    }

    static createSeller = async (req: Request, res: Response) => {
        const { mobileNumber } = req.body;
        logger.info("Create Seller initiated", { mobileNumber, requestBody: req.body });

        try {
            const userRepository = AppDataSource.getRepository(Users);
            const user = await userRepository.findOne({ where: { mobileNumber: mobileNumber } });

            if (!user) {
                logger.warn(`User with mobileNumber ${mobileNumber} not found.`);
                return res.status(404).json({ status: 404, message: "User not found" });
            }

            const pinRepository = AppDataSource.getRepository(Pin);
            const userPin = await pinRepository.findOne({ where: { mobileNumber: mobileNumber }, });

            if(!userPin.isapproved){
                return res.status(500).json({ error: 1, message: "Please Approve the User first" });
            }
            
            const dobDate = new Date(user.dob);
            const formattedDob = `${dobDate.getDate().toString().padStart(2, '0')}/${(dobDate.getMonth() + 1).toString().padStart(2, '0')}/${dobDate.getFullYear()}`;

            let formattedDoi = '';
            if(user && user.doi!==null){
            const doiDate = new Date(user.doi);
            formattedDoi = `${doiDate.getDate().toString().padStart(2, '0')}/${(doiDate.getMonth() + 1).toString().padStart(2, '0')}/${doiDate.getFullYear()}`;
            }

            const data = {
                businessname: user.businessname,
                settlementAccountName: user.settlementAccountName,
                sellerIdentifier: user.sellerIdentifier,
                mobileNumber: user.mobileNumber,
                emailId: user.emailId,
                mcc: user.mcc,
                turnoverType: user.turnoverType,
                acceptanceType: user.acceptanceType,
                ownershipType: user.ownershipType,
                city: user.city,
                district: user.district,
                stateCode: user.stateCode,
                pinCode: user.pinCode,
                pan: user.pan,
                gstNumber: user.gstNumber,
                settlementAccountNumber: user.settlementAccountNumber,
                settlementIFSC: user.settlementIFSC,
                latitude: user.latitude,
                longitude: user.longitude,
                addressLine1: user.addressLine1,
                addressLine2: user.addressLine2,
                llpInOrCin: user.llpInOrCin,
                udyogAadhaar: user.udyogAadhaar,
                dob: formattedDob,
                doi: formattedDoi,
                electricityBoardCode: user.electricityBoardCode,
                apiKey: "c15ee1ba106bbb15701212e8b0d5205b",
                salt: 'x11I10gRojenIsygXxl5a2yW8l111bGn',
                hash: "",
                isregistered: false // Initialize isregistered flag
            };

            logger.info(`Data before hashing for user ${user.businessname} with mobile: ${user.mobileNumber}`, { data });

            let hashed = SellerHash.sellerHash(data, ["businessname", "settlementAccountName", "sellerIdentifier", "mobileNumber", "emailId", "mcc", "turnoverType", "acceptanceType", "ownershipType", "city", "district", "stateCode", "pinCode", "pan", "gstNumber", "settlementAccountNumber", "settlementIFSC", "latitude", "longitude", "addressLine1", "addressLine2", "llpInOrCin", "udyogAadhaar", "dob", "doi", "electricityBoardCode", "apiKey"], ["salt"]);
            data.hash = hashed;
            qs.stringify(data);

            logger.info(`Data after hashing for user ${user.businessname}`, { data });

            const retryAxios = async (data: any, retries: number) => {
                for (let attempt = 0; attempt <= retries; attempt++) {
                    try {
                        const response = await axios.post("https://payes.payfi.co.in/payes/offline/addSeller", qs.stringify(data), {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        });
                        return response;
                    } catch (error) {
                        logger.error(`Attempt ${attempt + 1} failed for user ${user.businessname} with mobile: ${user.mobileNumber}`, { error });
                        if (attempt === retries) throw error;
                    }
                }
            };

            
            const response = await retryAxios(data, 3); // Retry 3 times

            // console.log(response);

            if (response) {
                const intResponse = response.data;
                const mainResponse = intResponse;

                const responseMessage = mainResponse && mainResponse.data ? SellerController.handleApiResponse(mainResponse.data.responseCode) : "No response data";
                logger.info(`Main response for user ${user.businessname} with mobile: ${user.mobileNumber}`, { mainResponse });

                //const responseMessage = SellerController.handleApiResponse(mainResponse.data.responseCode);


                // Update isregistered flag after successful creation
                if (mainResponse && mainResponse.code === 200) {
                    const pinRepository = AppDataSource.getRepository(Pin);
                    const pin = await pinRepository.findOne({ where: { mobileNumber: mobileNumber } });
                    pin.isregistered = true; // Update isregistered flag
                    pin.registeredDate= new Date();
                    await pinRepository.save(pin);

                    const sellerResponse = new SellerResponse(
                        mainResponse.code,
                        mainResponse.msg,
                        mainResponse.data.status,
                        mainResponse.data.sellerIdentifier,
                        mainResponse.data.responseCode,
                        // mainResponse.data.responseMessage,
                        responseMessage
                    );

                    logger.info(`Seller created successfully for user ${user.businessname} with mobile: ${user.mobileNumber}`, { sellerResponse });


                    return res.status(201).json({ status: 201, message: "Seller created successfully", data: sellerResponse });
                } else {
                    logger.error(`Error while creating seller for user ${user.businessname} with mobile: ${user.mobileNumber}`, { mainResponse });
                    return res.status(400).json({ status: 400, message: "Error while creating Seller" });
                }
            } else {
                logger.error(`No response received from the API for user ${user.businessname}  with mobile: ${user.mobileNumber}`);
                return res.status(400).json({ status: 400, message: "Error while creating Seller" });
            }
        } catch (error) {
            logger.error(`Error creating seller for user`, { error });
            return res.status(500).json({ error: 1, message: "Error creating seller" });
        }
    };
}

module.exports = SellerController;

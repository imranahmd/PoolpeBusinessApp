import { AppDataSource } from "../db/data-source";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { Users } from "../entity/Users";
import * as bcrypt from "bcryptjs";
import { Pin } from "../entity/Pin";
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
});

class AuthController {
    static getUser = async (req: Request, res: Response) => {
        const { mobileNumber } = req.body;
    
        if (!mobileNumber) {
            logger.warn("Mobile number not provided in getUser request", { requestBody: req.body });
            return res.status(400).json({ error: 1, status: 400, message: "Please provide a phone number." });
        }
    
        const userRepository = AppDataSource.getRepository(Users);
        const pinRepository = AppDataSource.getRepository(Pin);
    
        try {
            const user = await userRepository.findOne({ where: { mobileNumber: mobileNumber } });
    
            if (user) {
                const pin = await pinRepository.findOne({ where: { mobileNumber: mobileNumber } });
    
                if (pin) {
                    logger.info("User and Pin data found", { user, pin });
                    return res.status(200).json({ userData: user, pinData: pin, status: 200 });
                } else {
                    logger.warn("Pin data not found for given mobile number", { mobileNumber });
                    return res.status(404).json({ error: 1, status: 404, is_register: 0, message: "Pin data not found for the given mobile number." });
                }
            } else {
                logger.warn("User not found", { mobileNumber });
                return res.status(404).json({ error: 1, status: 404, is_register: 0, message: "User does not exist." });
            }
        } catch (error) {
            logger.error("Error fetching user or pin", { error });
            return res.status(500).json({ error: 1, status: 500, message: "Internal server error." });
        }
    };
    
    static createUser = async (req: Request, res: Response) => {
        const userRepository = AppDataSource.getRepository(Users);
        try {
            let {
                businessname,
                settlementAccountName,
                mobileNumber,
                emailId,
                mcc,
                turnoverType,
                acceptanceType,
                ownershipType,
                city,
                district,
                stateCode,
                pinCode,
                pan,
                gstNumber,
                settlementAccountNumber,
                settlementIFSC,
                latitude,
                longitude,
                addressLine1,
                addressLine2,
                llpInOrCin,
                udyogAadhaar,
                dob,
                doi,
                electricityBoardCode,
                apiKey,
                hash,
                qrString,
                panDocument,
                profilePhoto,
                profilePhotoFileType,
                panFileType
            } = req.body;

            const existingUser = await userRepository.findOne({ where: { mobileNumber: mobileNumber } });
            if (existingUser) {
                logger.warn("User already exists", { mobileNumber });
                return res.status(409).json({ error: 1, message: "User already exists" });
            }

            const lastUser = await userRepository
                .createQueryBuilder("user")
                .where("user.sellerIdentifier LIKE :pattern", { pattern: 'fipayp%' })
                .orderBy("user.sellerIdentifier", "DESC")
                .getOne();

            let newSellerIdentifier = "fipayp00001";

            if (lastUser && lastUser.sellerIdentifier) {
                const lastIdentifierNumber = parseInt(lastUser.sellerIdentifier.replace(/^fipayp(\d+)$/, '$1'));
                
                if (!isNaN(lastIdentifierNumber)) {
                    newSellerIdentifier = `fipayp${(lastIdentifierNumber + 1).toString().padStart(5, '0')}`;
                } else {
                    logger.warn("Malformed sellerIdentifier found", { lastUser });
                }
            }

            let newUser = {
                sellerIdentifier: newSellerIdentifier,
                businessname,
                settlementAccountName,
                mobileNumber,
                emailId,
                mcc,
                turnoverType,
                acceptanceType,
                ownershipType,
                city,
                district,
                stateCode,
                pinCode,
                pan,
                gstNumber,
                settlementAccountNumber,
                settlementIFSC,
                latitude,
                longitude,
                addressLine1,
                addressLine2,
                llpInOrCin,
                udyogAadhaar,
                dob,
                doi,
                electricityBoardCode,
                apiKey,
                hash,
                qrString,
                panDocument: Buffer.from(panDocument, 'base64'),
                profilePhoto: Buffer.from(profilePhoto, 'base64'),
                profilePhotoFileType,
                panFileType
            };

            const user = await userRepository.save(newUser);
            if (user && user.id) {
                const pinRepository = AppDataSource.getRepository(Pin);
                let newPin = new Pin();
                newPin.mobileNumber = mobileNumber;
                newPin.isapproved = false;
                newPin.passwordCreated = false;
                newPin.isQrGenrated = false;
                newPin.isregistered = false;
                await pinRepository.save(newPin);

                logger.info("User created successfully", { user });
                return res.status(201).json({ status: 201, message: "User created successfully", user: user });
            }
        } catch (error) {
            logger.error("Error creating user", { error });
            return res.status(500).json({ error: 1, message: "Error creating user" });
        }
    };

static updateUser = async (req: Request, res: Response) => {
    const { mobileNumber } = req.params;
    const userData = req.body;
    const userRepository = AppDataSource.getRepository(Users);

    try {
        const user = await userRepository.findOneOrFail({ where: { mobileNumber } });
        userRepository.merge(user, userData);
        await userRepository.save(user);

        logger.info("User updated successfully", { mobileNumber, userData });
        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        logger.error("Error updating user", { error });
        return res.status(404).json({ message: "User not found" });
    }
};

    static addPassword = async (req: Request, res: Response) => {
        const { mobileNumber, password } = req.body;

        if (!mobileNumber || !password) {
            logger.warn("Mobile number or password missing in addPassword request", { requestBody: req.body });
            return res.status(400).json({
                error: 1,
                status: 400,
                message: "Please provide Mobile Number and password.",
            });
        }

        try {
            const userRepository = AppDataSource.getRepository(Pin);
            const user = await userRepository.findOne({ where: { mobileNumber } });

            if (user && user.passwordCreated) {
                logger.warn("Password already exists for user", { mobileNumber });
                return res.status(400).json({
                    error: 1,
                    status: 400,
                    message: "Password already exists.",
                });
            }

            if (user) {
                user.password = bcrypt.hashSync(password, 8);
                user.passwordCreated = true;

                await userRepository.save(user);
                logger.info("Password added successfully", { mobileNumber });
                return res.status(200).json({
                    status: 200,
                    message: 'Password added successfully',
                });
            } else {
                logger.warn("User not found for adding password", { mobileNumber });
                return res.status(404).json({
                    error: 1,
                    status: 404,
                    message: "User not found.",
                });
            }
        } catch (error) {
            logger.error("Error adding password", { error });
            return res.status(500).json({
                error: 1,
                status: 500,
                message: 'Error adding password',
            });
        }
    };

    static updatePassword = async (req: Request, res: Response) => {
        const { mobileNumber, oldPassword, newPassword } = req.body;
        const userRepository = AppDataSource.getRepository(Pin);

        try {
            const user = await userRepository.findOne({ where: { mobileNumber } });
            if (!user) {
                logger.warn("User not found for updating password", { mobileNumber });
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = bcrypt.compareSync(oldPassword, user.password);
            if (!isMatch) {
                logger.warn("Old password incorrect", { mobileNumber });
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            user.oldPassword = user.password;
            user.password = bcrypt.hashSync(newPassword, 8);
            await userRepository.save(user);

            logger.info("Password updated successfully", { mobileNumber });
            return res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            logger.error("Error updating password", { error });
            return res.status(500).json({ message: 'Error updating password', error });
        }
    };


            static updateNewPassword = async (req: Request, res: Response) => {
            const { mobileNumber, newPassword } = req.body;
            const userRepository = AppDataSource.getRepository(Pin);

            try {
                const user = await userRepository.findOne({ where: { mobileNumber } });
                if (!user) {
                    logger.warn("User not found for updating new password", { mobileNumber });
                    return res.status(404).json({ message: 'User not found' });
                }

                user.oldPassword = user.password;
                user.password = bcrypt.hashSync(newPassword, 8);
                await userRepository.save(user);

                logger.info("Password updated successfully", { mobileNumber });
                return res.status(200).json({ message: 'Password updated successfully' });
            } catch (error) {
                logger.error("Error updating password", { error });
                return res.status(500).json({ message: 'Error updating password', error });
            }
        };
}  
module.exports = AuthController;

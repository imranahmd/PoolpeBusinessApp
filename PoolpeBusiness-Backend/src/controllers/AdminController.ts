import { AppDataSource } from "../db/data-source"
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { Users } from "../entity/Users";
import {pagination} from 'typeorm-pagination'
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import { Pin } from '../entity/Pin';
import {UserActivity} from "../entity/UserActivity"
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/AdminController.log' }),
    new winston.transports.Console()
  ]
});


class AdminController {

     static login = async (req: Request, res: Response) => {
    const { mobileNumber } = req.body;
  
    logger.info({ message: "Login request received", mobileNumber });
  
    if (!mobileNumber) {
      logger.warn({ message: "Mobile number not provided", mobileNumber });
      return res.status(400).json({
        error: 1,
        status: 400,
        message: "Please enter a mobile number.",
      });
    }
  
    try {
      const pinRepository = AppDataSource.getRepository(Pin);
  
      // Find the user in the Pin table
      const userPin = await pinRepository.findOne({ where: { mobileNumber } });
  
      if (!userPin) {
        logger.warn({ message: "User not found", mobileNumber });
        return res.status(404).json({
          error: 1,
          status: 404,
          message: "User does not exist!",
        });
      }
  
      // Check if the user is already logged in (isLoggedIn = true)
      if (userPin.isLoggedIn) {
        logger.warn({ message: "Account already in use", mobileNumber });
        return res.status(409).json({
          error: 1,
          status: 409,
          message: "Account already in use. Please logout from the other device.",
        });
      }
  
      // If the password is set, generate a JWT token
      if (userPin.passwordCreated) {
        const token = jwt.sign(
          { mobileNumber: userPin.mobileNumber, password: userPin.password },
          process.env.JWTSECRET || "",
          { expiresIn: "720h" }
        );
  
        const successResponse = {
          status: 200,
          message: "Login successful",
          approved: userPin.isregistered,
          token: token,
        };
  
        // Log the successful response
        logger.info({
          message: "Login successful",
          responseData: successResponse,
          username: mobileNumber,
        });
  
        // Update the database: set token and isLoggedIn = true
        userPin.token = token;
        userPin.isLoggedIn = false;
        await pinRepository.save(userPin);
  
        return res.status(200).json(successResponse);
      } else {
        // If the password does not exist, generate a first-time login token
        const firstToken = jwt.sign(
          { mobileNumber: userPin.mobileNumber },
          process.env.JWTSECRET || "",
          { expiresIn: "720h" }
        );
  
        const response = {
          token: firstToken,
          status: 200,
          approved: userPin.isregistered || false,
          message: "Password does not exist!!",
        };
  
        // Log the response data
        logger.info({
          message: "Password not set",
          responseData: response,
          username: mobileNumber,
        });
  
        // Update the database: set token and isLoggedIn = true
        userPin.token = firstToken;
        userPin.isLoggedIn = true;
        await pinRepository.save(userPin);
  
        return res.status(200).json(response);
      }
    } catch (error) {
      logger.error({ message: "Error during login", error: error.message });
      return res.status(500).json({
        error: 1,
        status: 500,
        message: "Error during login",
      });
    }
  };  


static updateLoggedInFlag = async (req: Request, res: Response) => {
  const { mobileNumber, isLoggedIn, logoutFlag } = req.body;

  logger.info({ message: "Updating login status", mobileNumber, isLoggedIn, logoutFlag });

  if (!mobileNumber) {
    return res.status(400).json({
      error: 1,
      status: 400,
      message: "Mobile number is required.",
    });
  }

  try {
    const pinRepository = AppDataSource.getRepository(Pin);

    // Find the user in the Pin table
    const userPin = await pinRepository.findOne({ where: { mobileNumber } });

    if (!userPin) {
      return res.status(404).json({
        error: 1,
        status: 404,
        message: "User does not exist!",
      });
    }

    // If logoutFlag is set to true, clear the token and reset the isLoggedIn flag
    if (logoutFlag) {
      userPin.isLoggedIn = false;
    } else {
      // Update the isLoggedIn flag based on the new login state
      userPin.isLoggedIn = isLoggedIn;
    }

    // Save the updated userPin
    await pinRepository.save(userPin);

    logger.info({ message: "Login status updated successfully", mobileNumber });

    return res.status(200).json({
      status: 200,
      message: "Login status updated successfully",
    });
  } catch (error) {
    logger.error({ message: "Error updating login status", error: error.message });
    return res.status(500).json({
      error: 1,
      status: 500,
      message: "Error updating login status",
    });
  }
};

  


  static sendEmail = async (req: Request, res: Response) => {
    const { to, subject, text } = req.body;
    logger.info('Email send request received', { requestBody: req.body });

    try {
      const userRepository = AppDataSource.getRepository(Users);
      const user = await userRepository.findOne({ where: { mobileNumber: to } }); // Adjust field name if necessary

      if (!user) {
        logger.warn('User not found for sending email', { mobileNumber: to });
        return res.status(404).json({ message: 'User not found' });
      }

      // Prepare user data for email content
      let userData = `
        <table border="1">
          <tr><th>Attribute</th><th>Value</th></tr>
          <tr><td>User ID</td><td>${user.id}</td></tr>
          <tr><td>Business Name</td><td>${user.businessname}</td></tr>
          <tr><td>Settlement Account Name</td><td>${user.settlementAccountName}</td></tr>
          <tr><td>Mobile Number</td><td>${user.mobileNumber}</td></tr>
          <tr><td>Email</td><td>${user.emailId}</td></tr>
          <tr><td>MCC</td><td>${user.mcc}</td></tr>
          <tr><td>Turnover Type</td><td>${user.turnoverType}</td></tr>
          <tr><td>Acceptance Type</td><td>${user.acceptanceType}</td></tr>
          <tr><td>Ownership Type</td><td>${user.ownershipType}</td></tr>
          <tr><td>City</td><td>${user.city}</td></tr>
          <tr><td>District</td><td>${user.district}</td></tr>
          <tr><td>State Code</td><td>${user.stateCode}</td></tr>
          <tr><td>Pin Code</td><td>${user.pinCode}</td></tr>
          <tr><td>PAN</td><td>${user.pan}</td></tr>
          <tr><td>GST Number</td><td>${user.gstNumber}</td></tr>
          <tr><td>Settlement Account Number</td><td>${user.settlementAccountNumber}</td></tr>
          <tr><td>Settlement IFSC</td><td>${user.settlementIFSC}</td></tr>
          <tr><td>Latitude</td><td>${user.latitude}</td></tr>
          <tr><td>Longitude</td><td>${user.longitude}</td></tr>
          <tr><td>Address Line 1</td><td>${user.addressLine1}</td></tr>
          <tr><td>Address Line 2</td><td>${user.addressLine2}</td></tr>
          <tr><td>LLP IN or CIN</td><td>${user.llpInOrCin}</td></tr>
          <tr><td>Udyog Aadhaar</td><td>${user.udyogAadhaar}</td></tr>
          <tr><td>Date of Birth</td><td>${user.dob}</td></tr>
          <tr><td>Date of Incorporation</td><td>${user.doi}</td></tr>
          <tr><td>Electricity Board Code</td><td>${user.electricityBoardCode}</td></tr>
        </table>
      `;


  const panDocumentAttachment = {
  filename: `PanDocument.${user.panFileType}`,
  content: user.panDocument,
  encoding: 'base64'
};

const picAttachment = {
  filename: `ProfilePhoto.${user.profilePhotoFileType}`,
  content: user.profilePhoto,
  encoding: 'base64'
};

        let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'admin@payfi.co.in',
                    pass: 'twor ygch xdls grof'
                }
            });

    let mailOptions;

   if (user.emailId.trim() === '') {
     mailOptions = {
       from: 'admin@payfi.co.in',
       to: 'poolpetech@gmail.com',
       subject: subject,
       html: `${text}<br/><br/>User Data:<br/>${userData}`,
       attachments: [
         panDocumentAttachment,
         picAttachment
       ]
     };
   } else {
     mailOptions = {
       from: 'admin@payfi.co.in',
       to: 'poolpetech@gmail.com',
       cc: user.emailId,
       subject: subject,
       html: `${text}<br/><br/>User Data:<br/>${userData}`,
       attachments: [
         panDocumentAttachment,
         picAttachment
       ]
     };
   }

   transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('Error sending email', { error });

      return res.status(500).json({ message: 'Failed to send email' });
    }
    logger.info('Email sent successfully', { mobileNumber: to, emailId: user.emailId });
    return res.status(200).json({ message: 'Email sent successfully' });
  });
} catch (error) {
  logger.error('Error occurred while sending email', { error });
  return res.status(500).json({ message: 'Failed to send email' });
}
  };

  static getAllUsers = async (req: Request, res: Response) => {
    logger.info('Fetching all users request received');
    const userRepository = AppDataSource.getRepository(Users);
    const pinRepository = AppDataSource.getRepository(Pin);

    try {
      const usersWithPins = await userRepository
        .createQueryBuilder("users")
        .leftJoinAndMapOne("users.pin", Pin, "pin", "users.mobileNumber = pin.mobileNumber")
        .select([
          "users",
          "pin.mobileNumber",
          "pin.isapproved",
          "pin.AgentID",
          "pin.AgentName",
          "pin.isregistered",
          "pin.isQrGenrated",
          "pin.registeredDate",
         "pin.created",
         "pin.updated",
        ])
        .getMany();

      const usersWithBase64Blobs = usersWithPins.map(user => ({
        ...user,
        profilePhoto: user.profilePhoto ? user.profilePhoto.toString('base64') : null,
        panDocument: user.panDocument ? user.panDocument.toString('base64') : null
      }));

      logger.info('Users fetched successfully', { userCount: usersWithBase64Blobs.length });
      return res.status(200).json({ status: 200, data: usersWithBase64Blobs });
    } catch (error) {
      logger.error('Error fetching users', { error });
      return res.status(500).json({ error: 1, status: 500, message: "An error occurred while fetching users." });
    }
  };


  static updateFlagApproved = async (req: Request, res: Response) => {
      const { mobileNumber, isapproved, AgentName, AgentID } = req.body;
      logger.info('Update flag approved request received', { requestBody: req.body });

      if (!mobileNumber) {
        logger.warn('Mobile number missing in update request');
        return res.status(400).json({ error: 1, status: 400, message: "mobileNumber is required" });
      }

      try {
        const pinRepository = AppDataSource.getRepository(Pin);
        const user = await pinRepository.findOneBy({ mobileNumber });

        if (!user) {
          logger.warn('User not found for update', { mobileNumber });
          return res.status(404).json({ error: 1, status: 404, message: "User not found with the given mobileNumber" });
        }

        if (isapproved !== undefined) user.isapproved = isapproved;
        if (AgentName !== undefined) user.AgentName = AgentName;
        if (AgentID !== undefined) user.AgentID = AgentID;

        await pinRepository.save(user);

        logger.info('User updated successfully', { mobileNumber });
        return res.status(200).json({ status: 200, message: "User updated successfully", data: user });
      } catch (error) {
        logger.error('Error updating user', { error });
        return res.status(500).json({ error: 1, status: 500, message: "An error occurred while updating the user" });
      }
    };


static sendOTP = async (req: Request, res: Response) => {
    const { mobileNumber } = req.body;
    const dest = mobileNumber;

    logger.info('Send OTP request received', { requestBody: req.body });
    // Hardcoded values
    const username = "cashFriendAPI";
    const apikey = "1RcJH2LbDUkRmii72u7ZK1GKRp7VG8Hs";
    const signature = "CFFPYF";
    const msgtype = "PM";
    const entityid = "1401590770000017381";
    const templateid = "1707171688851262754";

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    const msgtxt = `${otp} is your verifiction code for login. Regards- Team PayFi`;

    const url = 'https://api.telsp.in/pushapi/sendmsg';

    try {
      const response = await axios.get(url, {
        params: {
          username,
          dest,
          apikey,
          signature,
          msgtype,
          msgtxt,
          entityid,
          templateid,
        },
      });

      logger.info('OTP sent successfully', { mobileNumber: mobileNumber });
      res.status(200).json({ status: 'success', data: response.data, otp });
    } catch (error) {
      logger.error('Error sending OTP', { error });
      res.status(500).json({ status: 'error', message: error.message });
    }
  };

  static saveUserActivity = async (req: Request, res: Response) => {
    const { mobileNumber, serviceName, timestamp } = req.body;
    logger.info('Save user activity request received', { requestBody: req.body });

    const userActivityRepository = AppDataSource.getRepository(UserActivity);

    try {
        const newActivity = new UserActivity();
        newActivity.mobileNumber = mobileNumber;
        newActivity.serviceName = serviceName;
        newActivity.timestamp = new Date(timestamp);

        await userActivityRepository.save(newActivity);
        logger.info('User activity saved successfully', { activity: newActivity });

        return res.status(201).json({
            message: "User activity saved successfully",
            data: newActivity
        });
    } catch (error) {
        logger.error('Error saving user activity', { error });
        return res.status(500).json({
            message: "Error saving user activity",
            error: error.message
        });
    }
};

 
}
module.exports = AdminController;

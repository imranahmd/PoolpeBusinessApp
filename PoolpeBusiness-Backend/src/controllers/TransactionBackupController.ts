import { Request, Response } from "express";
import * as ExcelJS from 'exceljs';
const FundOrderController = require('./FundOrderController');
import axios from "axios";
const winston = require('winston');
import * as nodemailer from 'nodemailer';
import { AppDataSource } from "../db/data-source";
import { Users } from "../entity/Users";

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

export class TransactionBackupController {

    // Generate and download Excel for transactions within time range
    // static generateExcel = async (req: Request, res: Response): Promise<void> => {
    //     const { mobileNumber, startTime, endTime } = req.body;

    //     try {
    //         // Call FundOrderController to fetch transactions
    //         const transactionsResponse = await FundOrderController.createFundOrder(mobileNumber);
    //         console.log(transactionsResponse);
    //         const transactions = transactionsResponse.data.fundOrderList; // Assuming response contains the data property

    //         if (!transactions || transactions.length === 0) {
    //             res.status(404).json({ message: "No transactions found for the given criteria" });
    //             return;
    //         }

    //         // Create Excel file
    //         const workbook = new ExcelJS.Workbook();
    //         const worksheet = workbook.addWorksheet('Transactions');

    //         worksheet.columns = [
    //             { header: 'Mobile Number', key: 'mobileNumber', width: 15 },
    //             { header: 'Business Name', key: 'businessName', width: 25 },
    //             { header: 'Email ID', key: 'emailId', width: 25 },
    //             { header: 'Date & Time', key: 'txnTime', width: 20 },
    //             { header: 'Transaction UTR', key: 'transactionUTR', width: 20 },
    //             { header: 'Amount', key: 'amount', width: 10 },
    //             { header: 'Payment Originated From', key: 'paymentOriginatedFrom', width: 25 },
    //             { header: 'Transaction ID', key: 'transactionId', width: 20 },
    //             { header: 'UTR No', key: 'utrNumber', width: 20 },
    //         ];

    //         // Add transactions to the worksheet
    //         transactions.forEach((transaction) => {
    //             worksheet.addRow({
    //                 mobileNumber: transaction.mobileNumber,
    //                 businessName: transaction.businessName,
    //                 emailId: transaction.emailId,
    //                 txnTime: transaction.txnTime,
    //                 transactionUTR: "transaction.txnId",
    //                 amount: transaction.amount,
    //                 paymentOriginatedFrom: transaction.payerVPA,
    //                 transactionId: transaction.txnId,
    //                 utrNumber: transaction.utr,
    //             });
    //         });

    //         // Send the Excel file to the client
    //         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //         res.setHeader('Content-Disposition', 'attachment; filename=transactions.xlsx');
    //         await workbook.xlsx.write(res);
    //         res.end();
    //     } catch (error) {
    //         console.error("Error generating Excel file", error);
    //         res.status(500).json({ error: "Error generating Excel file" });
    //     }
    // };

    static generateExcel = async (req: Request, res: Response): Promise<void> => {
        const { mobileNumber, to, subject, text } = req.body; 
        

        const userRepository = AppDataSource.getRepository(Users);
        const user = await userRepository.findOne({ where: { mobileNumber: mobileNumber } });

        if (!user) {
            logger.warn(`User with mobileNumber ${mobileNumber} not found.`);
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        console.log("Request Body:", req.body);

        try {
            // Call the 3rd party API to fetch transactions
            const transactionsResponse = await axios.post(
                'https://prod.payfi.co.in/poolpebusiness/api/fundorder/createfundorder',
                new URLSearchParams({ mobileNumber }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            console.log("Transactions Response:", transactionsResponse.data);

            const { data } = transactionsResponse.data; 
            const transactions = data.fundOrderList; 

            if (!transactions || transactions.length === 0) {
                res.status(404).json({ message: "No transactions found for the given criteria" });
                return;
            }

            // Create Excel file in memory
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Transactions');

            worksheet.columns = [
                { header: 'Name', key: 'name', width: 20 },
                { header: 'Amount', key: 'amount', width: 10 },
                { header: 'Payer VPA', key: 'payerVPA', width: 25 },
                { header: 'Response Message', key: 'responseMessage', width: 30 },
                { header: 'Seller Identifier', key: 'sellerIdentifier', width: 25 },
                { header: 'Status', key: 'status', width: 10 },
                { header: 'Transaction ID', key: 'txnId', width: 20 },
                { header: 'Date & Time', key: 'txnTime', width: 20 },
                { header: 'UTR', key: 'utr', width: 20 },
            ];

            transactions.forEach((transaction) => {
                worksheet.addRow({
                    name: user.businessname,
                    amount: transaction.amount,
                    payerVPA: transaction.payerVPA,
                    responseMessage: transaction.responseMessage,
                    sellerIdentifier: transaction.sellerIdentifier,
                    status: transaction.status,
                    txnId: transaction.txnId,
                    txnTime: transaction.txnTime,
                    utr: transaction.utr,
                });
            });

            // Prepare email transport
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'admin@payfi.co.in',
                    pass: 'twor ygch xdls grof',
                },
            });

            
            const emailOptions = {
                from: 'admin@payfi.co.in',
                to: 'binti@payfi.co.in',
                subject: subject,
                html: `${text}<br/><br/>Please find the attached transactions report.`,
                attachments: [
                    {
                        filename: `${user.businessname}_transactions.xlsx`,
                        content: await workbook.xlsx.writeBuffer(),
                        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    },
                ],
            };

            
            transporter.sendMail(emailOptions, (error, info) => {
                if (error) {
                    logger.error('Error sending email', { error });
                    return res.status(500).json({ message: 'Failed to send email' });
                }
                logger.info('Email sent successfully', { to, subject });
                return res.status(200).json({ message: 'Email sent successfully' });
            });

        } catch (error) {
            console.error("Error generating Excel file or sending email", error);
            res.status(500).json({ message: 'Failed to generate Excel or send email' });
        }
    };


    // static generateExcel = async (req: Request, res: Response): Promise<void> => {
    //     const { subject, text } = req.body;
    
    //     const userRepository = AppDataSource.getRepository(Users);
    
    //     try {
    //         // Fetch all users from the database
    //         const users = await userRepository.find();
    //         if (!users || users.length === 0) {
    //             logger.warn("No users found in the database.");
    //             return res.status(404).json({ message: "No users found" });
    //         }
    
    //         // Prepare email transport (SMTP configuration)
    //         const transporter = nodemailer.createTransport({
    //             host: 'smtp.gmail.com',
    //             port: 465,
    //             secure: true,
    //             auth: {
    //                 user: 'admin@payfi.co.in',
    //                 pass: 'twor ygch xdls grof',
    //             },
    //         });
    
    //         // Loop through each user and fetch transactions + generate Excel + send email
    //         for (const user of users) {
    //             try {
    //                 // Call the 3rd party API for each user based on their mobile number
    //                 const transactionsResponse = await axios.post(
    //                     'https://prod.payfi.co.in/poolpebusiness/api/fundorder/createfundorder',
    //                     new URLSearchParams({ mobileNumber: user.mobileNumber }).toString(),
    //                     {
    //                         headers: {
    //                             'Content-Type': 'application/x-www-form-urlencoded',
    //                         },
    //                     }
    //                 );
    
    //                 console.log(`Transactions Response for ${user.businessname}:`, transactionsResponse.data);
    
    //                 const { data } = transactionsResponse.data;
    //                 const transactions = data.fundOrderList;
    
    //                 if (!transactions || transactions.length === 0) {
    //                     logger.warn(`No transactions found for user: ${user.businessname}`);
    //                     continue;
    //                 }
    
    //                 // Create Excel file for the current user
    //                 const workbook = new ExcelJS.Workbook();
    //                 const worksheet = workbook.addWorksheet('Transactions');
    
    //                 worksheet.columns = [
    //                     { header: 'Name', key: 'name', width: 20 },
    //                     { header: 'Amount', key: 'amount', width: 10 },
    //                     { header: 'Payer VPA', key: 'payerVPA', width: 25 },
    //                     { header: 'Response Message', key: 'responseMessage', width: 30 },
    //                     { header: 'Seller Identifier', key: 'sellerIdentifier', width: 25 },
    //                     { header: 'Status', key: 'status', width: 10 },
    //                     { header: 'Transaction ID', key: 'txnId', width: 20 },
    //                     { header: 'Date & Time', key: 'txnTime', width: 20 },
    //                     { header: 'UTR', key: 'utr', width: 20 },
    //                 ];
    
    //                 transactions.forEach((transaction) => {
    //                     worksheet.addRow({
    //                         name: user.businessname,
    //                         amount: transaction.amount,
    //                         payerVPA: transaction.payerVPA,
    //                         responseMessage: transaction.responseMessage,
    //                         sellerIdentifier: transaction.sellerIdentifier,
    //                         status: transaction.status,
    //                         txnId: transaction.txnId,
    //                         txnTime: transaction.txnTime,
    //                         utr: transaction.utr,
    //                     });
    //                 });
    
                    
    //                 const emailOptions = {
    //                     from: 'admin@payfi.co.in',
    //                     to: 'binti@payfi.co.in',
    //                     cc: 'ashutosh.singh@payfi.co.in',
    //                     subject: subject,
    //                     html: `${text}<br/><br/>Please find the attached transactions report for ${user.businessname}.`,
    //                     attachments: [
    //                         {
    //                             filename: `${user.businessname}_transactions.xlsx`,
    //                             content: await workbook.xlsx.writeBuffer(),
    //                             contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //                         },
    //                     ],
    //                 };
    
                    
    //                 transporter.sendMail(emailOptions, (error, info) => {
    //                     if (error) {
    //                         logger.error(`Error sending email to ${user.businessname}`, { error });
    //                     } else {
    //                         logger.info(`Email sent successfully to ${user.businessname}`, { to: 'binti@payfi.co.in', subject });
    //                     }
    //                 });
    
    //             } catch (apiError) {
    //                 logger.error(`Error fetching transactions for user ${user.businessname}`, { apiError });
    //             }
    //         }
    
            
    //         res.status(200).json({ message: 'Emails sent successfully to all users' });
    
    //     } catch (error) {
    //         console.error("Error generating Excel file or sending email", error);
    //         res.status(500).json({ message: 'Failed to generate Excel or send email' });
    //     }
    // };
    
    static generateExcelForAll = async (req: Request, res: Response): Promise<void> => {
        const { subject, text } = req.body;
    
        const userRepository = AppDataSource.getRepository(Users);
    
        try {
            // Fetch all users from the database
            const users = await userRepository.find();
            if (!users || users.length === 0) {
                logger.warn("No users found in the database.");
                return res.status(404).json({ message: "No users found" });
            }
    
            // Prepare email transport (SMTP configuration)
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'admin@payfi.co.in',
                    pass: 'twor ygch xdls grof',
                },
            });
    
            // Create Excel file to store all transactions
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('All Transactions');
    
            // Set up columns for the Excel sheet
            worksheet.columns = [
                { header: 'User Name', key: 'name', width: 20 },
                { header: 'Amount', key: 'amount', width: 10 },
                { header: 'Payer VPA', key: 'payerVPA', width: 25 },
                { header: 'Response Message', key: 'responseMessage', width: 30 },
                { header: 'Seller Identifier', key: 'sellerIdentifier', width: 25 },
                { header: 'Status', key: 'status', width: 10 },
                { header: 'Transaction ID', key: 'txnId', width: 20 },
                { header: 'Date & Time', key: 'txnTime', width: 20 },
                { header: 'UTR', key: 'utr', width: 20 },
            ];
    
            // Loop through each user and fetch transactions
            for (const user of users) {
                try {
                    // Call the 3rd party API for each user based on their mobile number
                    const transactionsResponse = await axios.post(
                        'https://prod.payfi.co.in/poolpebusiness/api/fundorder/createfundorder',
                        new URLSearchParams({ mobileNumber: user.mobileNumber }).toString(),
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        }
                    );
    
                    console.log(`Transactions Response for ${user.businessname}:`, transactionsResponse.data);
    
                    const { data } = transactionsResponse.data;
                    const transactions = data.fundOrderList;
    
                    if (!transactions || transactions.length === 0) {
                        logger.warn(`No transactions found for user: ${user.businessname}`);
                        continue;
                    }
    
                    // Add each transaction to the worksheet
                    transactions.forEach((transaction) => {
                        worksheet.addRow({
                            name: user.businessname,
                            amount: transaction.amount,
                            payerVPA: transaction.payerVPA,
                            responseMessage: transaction.responseMessage,
                            sellerIdentifier: transaction.sellerIdentifier,
                            status: transaction.status,
                            txnId: transaction.txnId,
                            txnTime: transaction.txnTime,
                            utr: transaction.utr,
                        });
                    });
    
                } catch (apiError) {
                    logger.error(`Error fetching transactions for user ${user.businessname}`, { apiError });
                }
            }
    
            // Prepare email options for the consolidated Excel file
            const emailOptions = {
                from: 'admin@payfi.co.in',
                to: 'ashutosh.singh@payfi.co.in',
                cc: 'binti@payfi.co.in',
                subject: subject,
                html: `${text}<br/><br/>Please find the attached consolidated transactions report.`,
                attachments: [
                    {
                        filename: 'all_transactions.xlsx',
                        content: await workbook.xlsx.writeBuffer(),
                        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    },
                ],
            };
    
            // Send the email with the consolidated Excel file
            transporter.sendMail(emailOptions, (error, info) => {
                if (error) {
                    logger.error('Error sending consolidated email', { error });
                    return res.status(500).json({ message: 'Failed to send email' });
                }
                logger.info('Consolidated email sent successfully', { to: 'binti@payfi.co.in', subject });
                return res.status(200).json({ message: 'Consolidated email sent successfully' });
            });
    
        } catch (error) {
            console.error("Error generating Excel file or sending email", error);
            res.status(500).json({ message: 'Failed to generate Excel or send email' });
        }
    };
    
}

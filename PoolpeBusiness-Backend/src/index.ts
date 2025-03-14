import * as express from "express";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./db/data-source";
const cors = require("cors");

import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import sellerRoutes from "./routes/sellerRoutes";
import qrRoutes from "./routes/qrRoutes";
import fundOrderRoutes from "./routes/fundOrderRoutes";
import fundSettleRoutes from "./routes/fundSettleRoutes";
import editSellerRoutes from "./routes/editSellerRoutes";
import { pagination } from "typeorm-pagination";
import { Users } from "./entity/Users";
import { LoginLog } from "./entity/LoginLog";
import transactionRoutes from "./routes/transactionBackupRoutes";

const winston = require("winston");

// Initialize Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.File({ filename: "logs/loginInfo.log" }),
  ],
});


// Function to fetch username based on mobile number
async function getUsernameFromMobile(mobileNumber: string): Promise<string | null> {
  const user = await AppDataSource.getRepository(Users).findOne({ where: { mobileNumber } });
  return user ? user.businessname : null;
}

// Initialize database and start server
AppDataSource.initialize()
  .then(async () => {
    const app = express();
    global.__basedir = __dirname;

        // Increase the limit for JSON payloads
        app.use(bodyParser.json({ limit: '50mb' }));

        // Increase the limit for URL-encoded payloads
        app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


    const allowedOrigins = [
      'https://poolpebusinessadmin.payfi.co.in',
      'http://localhost:3000',
      'http://10.0.2.2:8000',
      'https://uatpoolpebusinessadmin.payfi.co.in',
      'https://prodpoolpebusinessadmin.payfi.co.in',
      'https://dev.payfi.co.in/poolpebusiness/'   

];

    // Configure CORS to allow requests from localhost:3000
    app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);


       // Route logging for requests
       app.use(async (req, res, next) => {
        if (req.url.startsWith("/logs") || req.url.startsWith("/api/logs")) {
          return next();
        }
        const mobileNumber = req.body.mobileNumber || req.query.mobileNumber; // Get mobile number from request
        const username = mobileNumber ? await getUsernameFromMobile(mobileNumber) : "Unknown User";
  
        const logEntry = {
          apiEndpoint: req.url,
          username,
          mobileNumber: mobileNumber || null,
          timestamp: new Date(),
        };
  
        // Log API hit, username, mobile number, and timestamp in the file
        logger.info({
          message: `API hit: ${req.url}, Username: ${username}, Mobile: ${mobileNumber}, Timestamp: ${new Date().toISOString()}`,
        });
  
        // Save the log entry to the database
        const apiLog = new LoginLog();
        apiLog.apiEndpoint = logEntry.apiEndpoint;
        apiLog.username = logEntry.username;
        apiLog.mobileNumber = logEntry.mobileNumber;
        apiLog.timestamp = logEntry.timestamp;
  
        await AppDataSource.getRepository(LoginLog).save(apiLog); // Save the log entry to the database
  
        next();
      });

    // Endpoint to serve the log visualization page
    app.get("/logs", async (req, res) => {
      // Fetch all logs for the initial load
      const allLogs = await AppDataSource.getRepository(LoginLog).find();

      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Logs</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Login Logs</h1>
            <form method="GET" action="/logs">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username">
                <label for="mobileNumber">Mobile Number:</label>
                <input type="text" id="mobileNumber" name="mobileNumber">
                <button type="submit">Filter</button>
            </form>
            <h2>All Logs</h2>
            <table>
                <tr>
                    <th>API Endpoint</th>
                    <th>Username</th>
                    <th>Mobile Number</th>
                    <th>Timestamp</th>
                </tr>
                <tbody id="logsTableBody">
                    ${allLogs.map(log => `
                        <tr>
                            <td>${log.apiEndpoint}</td>
                            <td>${log.username || "N/A"}</td>
                            <td>${log.mobileNumber || "N/A"}</td>
                            <td>${log.timestamp}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <script>
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const username = urlParams.get('username');
                const mobileNumber = urlParams.get('mobileNumber');

                if (username || mobileNumber) {
                    fetch('/api/logs?username=' + username + '&mobileNumber=' + mobileNumber)
                        .then(response => response.json())
                        .then(data => {
                            const logsTableBody = document.getElementById('logsTableBody');
                            logsTableBody.innerHTML = ''; // Clear current logs
                            data.forEach(log => {
                                logsTableBody.innerHTML += '<tr><td>' + log.apiEndpoint + '</td><td>' + (log.username || "N/A") + '</td><td>' + (log.mobileNumber || "N/A") + '</td><td>' + log.timestamp + '</td></tr>';
                            });
                        });
                }
            </script>
        </body>
        </html>
      `);
    });

    // Endpoint to get logs based on filters
    app.get("/api/logs", async (req, res) => {
      const { username, mobileNumber } = req.query;

      const query = AppDataSource.getRepository(LoginLog).createQueryBuilder("log");

      if (username) {
        query.andWhere("log.username LIKE :username", { username: `%${username}%` });
      }

      if (mobileNumber) {
        query.andWhere("log.mobileNumber LIKE :mobileNumber", { mobileNumber: `%${mobileNumber}%` });
      }

      const logs = await query.getMany();
      res.json(logs);
    });


    // Application routes
    app.use("/api/auth", authRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/seller", sellerRoutes);
    app.use("/api/qr", qrRoutes);
    app.use("/api/fundorder", fundOrderRoutes);
    app.use("/api/fundsettle", fundSettleRoutes);
    app.use("/api/existingseller", editSellerRoutes);
    app.use("/api/backUp", transactionRoutes);

    // Pagination middleware
    app.use(pagination);

    require("dotenv").config();

    const port = process.env.PORT || 8000;
    app.use(express.static("public"));

    // Start server and log the event
    app.listen(port, "0.0.0.0", () => {
      logger.info(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    // Log the error
    logger.error(`Error initializing app: ${error.message}`, { stack: error.stack });
  });
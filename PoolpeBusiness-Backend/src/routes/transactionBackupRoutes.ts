import { Router } from "express";
import { TransactionBackupController } from "../controllers/TransactionBackupController";

const router = Router();

// router.post("/transactions", async (req, res) => {
//     try {
//         const transactionData = req.body;
//         await TransactionBackupController.saveTransaction(transactionData);
//         res.status(201).json({ message: "Transaction saved successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Error saving transaction" });
//     }
// });


router.post("/transactions/excel", TransactionBackupController.generateExcel);
router.post("/transactions/excelForAll", TransactionBackupController.generateExcelForAll);

export default router;

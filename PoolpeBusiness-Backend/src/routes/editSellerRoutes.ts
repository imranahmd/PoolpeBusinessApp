import {Router} from "express";
import { checkJwt } from "../middlewares/checkJwt";


const EditSellerController = require("../controllers/EditSellerController");

const router = Router();
router.post("/editseller" ,[checkJwt], EditSellerController.editSeller);

export default router;

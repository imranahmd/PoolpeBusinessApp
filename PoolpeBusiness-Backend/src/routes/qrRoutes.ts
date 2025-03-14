import { Router } from "express";
import { Qr } from "../yesbankdto/Qr";
import { checkJwt } from "../middlewares/checkJwt";
// const sellerHash = require("../utilities/SellerHash");
const QrController = require("../controllers/QrController");


const router = Router();

router.post("/createqr", QrController.createQr);



export default router;  

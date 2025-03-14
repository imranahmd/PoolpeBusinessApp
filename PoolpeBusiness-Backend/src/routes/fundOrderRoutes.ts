import { Router } from "express";
import { Qr } from "../yesbankdto/Qr";
import { FundOrder } from "../yesbankdto/FundOrder";
// const sellerHash = require("../utilities/SellerHash");
const FundOrderController = require("../controllers/FundOrderController");
import { checkJwt } from "../middlewares/checkJwt";


const router = Router();

//to create seller
router.post("/createfundorder", FundOrderController.createFundOrder);



export default router;  

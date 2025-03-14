import { Router } from "express";
import { Seller } from "../yesbankdto/Seller";
import { FundSettle} from "../yesbankdto/FundSettle"
import { checkJwt } from "../middlewares/checkJwt";
// const sellerHash = require("../utilities/SellerHash");
const SellerController = require("../controllers/SellerController");
const FundSettleController = require("../controllers/FundSettleController")


const router = Router();

router.post("/createfundsettle", FundSettleController.createFundSettle);





export default router;  

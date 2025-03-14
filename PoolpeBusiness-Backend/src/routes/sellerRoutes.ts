import { Router } from "express";
import { Seller } from "../yesbankdto/Seller";
import { checkJwt } from "../middlewares/checkJwt";
// const sellerHash = require("../utilities/SellerHash");
const SellerController = require("../controllers/SellerController");



const router = Router();

//to create seller
// router.post("/createseller", SellerController.createSeller);
router.post("/createseller", SellerController.createSeller);



export default router;  

import { Router } from "express";
const AdminController = require("../controllers/AdminController");

import { adminCheckJwt, checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/login", AdminController.login);



router.post("/updateLoggedInFlag", AdminController.updateLoggedInFlag);

router.post("/mail", AdminController.sendEmail);


router.get("/allUser",  AdminController.getAllUsers);


router.put("/updateFlagApproved", AdminController.updateFlagApproved);


router.post('/otp',  AdminController.sendOTP);


router.post('/userActivity',[checkJwt],  AdminController.saveUserActivity);
export default router;

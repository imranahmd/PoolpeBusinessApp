 import { Router } from "express";
const AuthController = require("../controllers/AuthController");
import { checkJwt } from "../middlewares/checkJwt";
const router = Router();

// Define routes
router.post("/getUser",[checkJwt], AuthController.getUser);

router.post('/registration', AuthController.createUser);

// Update User
router.put('/users/:MobileNumber',[checkJwt], AuthController.updateUser);

router.post('/add-password', AuthController.addPassword);
router.post('/update-password',[checkJwt], AuthController.updatePassword);

router.post('/update-new-password',[checkJwt], AuthController.updateNewPassword);

export default router;

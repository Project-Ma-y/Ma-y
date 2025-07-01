import { Router } from "express";
import { registerHandler, loginUserHandler } from "../controllers/authController";


const router = Router();

router.post("/signupEmail", registerHandler);
router.post("/loginID", loginUserHandler);

export default router;
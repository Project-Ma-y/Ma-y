import { Router } from "express";
import { registerHandler } from "../controllers/usersController";

const router = Router();

//router.get("/", getSignupEmail);
router.get("/signupEmail", registerHandler);

export default router;
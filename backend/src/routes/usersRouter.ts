import { Router } from "express";
import { registerHandler } from "../controllers/usersController";
import { registerBooking } from "../controllers/bookingsController";


const router = Router();

router.post("/signupEmail", registerHandler);

export default router;
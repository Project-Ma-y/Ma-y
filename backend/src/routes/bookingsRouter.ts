import { Router } from "express";
import { registerBooking } from "../controllers/bookingsController";

const router = Router();

router.get("/registerBooking", registerBooking);

export default router;
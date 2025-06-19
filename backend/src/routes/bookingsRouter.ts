import { Router } from "express";
import { getMainPage } from "../controllers/bookingsController";

const router = Router();

router.get("/", getMainPage);

export default router;
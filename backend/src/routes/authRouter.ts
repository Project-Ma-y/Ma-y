import { Router } from "express";
import { registerHandler } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";


const router = Router();

router.post("/signupEmail", registerHandler);
router.post("/auth", verifyFirebaseToken);

export default router;

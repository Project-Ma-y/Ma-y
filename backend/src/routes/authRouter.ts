import { Router } from "express";
import { registerHandler, testAuth } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";


const router = Router();

router.post("/signupEmail", registerHandler);
router.get("/auth", verifyFirebaseToken, testAuth);

export default router;

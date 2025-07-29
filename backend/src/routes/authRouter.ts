import { Router } from "express";
import { registerHandler, testAuth } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { loadSession } from "../middleware/sessionMiddleware";


const router = Router();

router.post("/signupEmail", registerHandler); //회원가입 + 세션
router.get("/auth", verifyFirebaseToken, loadSession, testAuth);

export default router;

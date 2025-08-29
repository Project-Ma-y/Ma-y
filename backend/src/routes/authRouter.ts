import { Router } from "express";
import { registerHandler, testAuth, adminCheck, registerParent } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { loadSession, noCache } from "../middleware/sessionMiddleware";

const router = Router();

router.post("/signupEmail", loadSession, noCache, registerHandler); //회원가입 + 세션
router.get("/test", verifyFirebaseToken, loadSession, testAuth);
router.get("/checkAdmin", verifyFirebaseToken, loadSession, adminCheck);

//router.post("/signupSenior", verifyFirebaseToken, loadSession, registerParent); //부모 회원가입

export default router;

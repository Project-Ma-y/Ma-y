import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { loadSession, noCache } from "../middleware/sessionMiddleware";
import { getSignupConversion, getApplicationReach, getApplicationConversion } from "../controllers/statsController";


const router = Router();

router.get("/signup-conversion", verifyFirebaseToken, loadSession, getSignupConversion); //회원가입 전환율
router.get("/application-reach", verifyFirebaseToken, loadSession, getApplicationReach); //동행신청 페이지 도달율
router.get("/application-conversion", verifyFirebaseToken, loadSession, getApplicationConversion); //동행신청 전환율

export default router;
 
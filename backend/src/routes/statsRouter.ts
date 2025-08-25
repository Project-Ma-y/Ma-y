import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { loadSession, noCache } from "../middleware/sessionMiddleware";
import { getSignupConversion, getApplicationReach, getApplicationConversion } from "../controllers/statsController";
import { checkAdminUid } from "../middleware/checkAdminUid";


const router = Router();

router.get("/signup-conversion", verifyFirebaseToken, loadSession, checkAdminUid, getSignupConversion); //회원가입 전환율
router.get("/application-reach", verifyFirebaseToken, loadSession, checkAdminUid, getApplicationReach); //동행신청 페이지 도달율
router.get("/application-conversion", verifyFirebaseToken, loadSession, checkAdminUid, getApplicationConversion); //동행신청 전환율

export default router;
 
import { Router } from "express";
import { updateLanding, updateBookingPage, readCookie } from "../controllers/sessionsController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { loadSession, noCache } from "../middleware/sessionMiddleware";

const router = Router();

router.get("/main", loadSession, noCache, updateLanding); //랜딩페이지, 세션 생성
//회원가입 완료(회원가입 로직에서)
router.get("/booking", verifyFirebaseToken, loadSession, noCache, updateBookingPage); //동행신청 시작
//예약 완료(예약 로직에서)

router.get("/cookie", readCookie); //테스트

export default router; 
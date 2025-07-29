import { Router } from "express";
import { updateLanding, updateBookingPage } from "../controllers/sessionsController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { loadSession } from "../middleware/sessionMiddleware";

const router = Router();

router.post("/main", updateLanding); //랜딩페이지, 세션 생성
//회원가입 완료(회원가입 로직에서)
router.post("/booking", verifyFirebaseToken, loadSession, updateBookingPage); //동행신청 시작
//예약 완료(예약 로직에서)

export default router; 
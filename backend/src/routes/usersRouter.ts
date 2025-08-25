import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { loadSession, noCache } from "../middleware/sessionMiddleware";


const router = Router();

router.get("/users", verifyFirebaseToken, loadSession, ); //가입자 집계
router.get("/users/:id", verifyFirebaseToken, loadSession, ); //회원 상세 정보 조회
router.delete("/users/:id", verifyFirebaseToken, loadSession, ); //회원 삭제

export default router;
 
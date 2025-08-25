import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { loadSession, noCache } from "../middleware/sessionMiddleware";
import { getAllUsers, getUserById, deleteUser } from "../controllers/usersController";

const router = Router();

router.get("/", verifyFirebaseToken, loadSession, getAllUsers); //가입자 집계
router.get("/:id", verifyFirebaseToken, loadSession, getUserById); //회원 상세 정보 조회
router.delete("/:id", verifyFirebaseToken, loadSession, deleteUser); //회원 삭제

export default router;
 
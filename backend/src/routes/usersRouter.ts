import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { loadSession, noCache } from "../middleware/sessionMiddleware";
import { getAllUsers, getUserByUID, deleteUser, updateUser, getMyProfile } from "../controllers/usersController";
import { checkAdminUid } from "../middleware/checkAdminUid";

const router = Router();

router.get("/:id", verifyFirebaseToken, loadSession, checkAdminUid, getUserByUID); //회원 상세 정보 조회
router.put("/:id", verifyFirebaseToken, loadSession, updateUser); //정보 업데이트
router.delete("/:id", verifyFirebaseToken, loadSession, checkAdminUid, deleteUser); //회원 삭제

router.get("/me", verifyFirebaseToken, loadSession, getMyProfile); //내 정보 보기
router.get("/", verifyFirebaseToken, loadSession, checkAdminUid, getAllUsers); //가입자 집계

export default router;
 
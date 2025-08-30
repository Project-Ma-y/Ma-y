import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { loadSession, noCache } from "../middleware/sessionMiddleware";
import { getAllUsers, getUserByUID, deleteUser, updateUserProfile, updateUserPassword, getMyProfile, addFamily, updateFamily, deleteFamily} from "../controllers/usersController";
import { checkAdminUid } from "../middleware/checkAdminUid";

const router = Router();

router.get("/me", verifyFirebaseToken, loadSession, noCache, getMyProfile); //내 정보 보기
router.put("/me/profile", verifyFirebaseToken, loadSession, updateUserProfile); //프로필 업데이트
router.put("/me/password", verifyFirebaseToken, loadSession, updateUserPassword); //비밀번호 업데이트
router.get("/:id", verifyFirebaseToken, loadSession, checkAdminUid, getUserByUID); //회원 상세 정보 조회
router.delete("/:id", verifyFirebaseToken, loadSession, checkAdminUid, deleteUser); //회원 삭제
router.post("/family", verifyFirebaseToken, loadSession, addFamily); //가족 더하기
router.put("/family/:mid", verifyFirebaseToken, loadSession, updateFamily); //가족 정보 수정
router.delete("/family/:mid", verifyFirebaseToken, loadSession, deleteFamily) //가족 삭제

router.get("/", verifyFirebaseToken, loadSession, checkAdminUid, getAllUsers); //가입자 집계

//router.put("/me/parentProfile", verifyFirebaseToken, loadSession, updateUserParentProfile); //부모 프로필 업데이트
//router.delete("/:id", verifyFirebaseToken, loadSession, checkAdminUid, deleteUserParent); //부모 삭제

export default router;
 
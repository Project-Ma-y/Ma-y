import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { createBooking, getAllBookings, getMyBookings, getBookingById, updateBooking, deleteBooking } from "../controllers/bookingsController";
import { loadSession, noCache } from "../middleware/sessionMiddleware";

const router = Router();

router.post("/", verifyFirebaseToken, loadSession, noCache, createBooking); //새 예약
router.get("/admin", verifyFirebaseToken, loadSession, getAllBookings); //예약 전체 불러오기, 관리자용
router.get("/my", verifyFirebaseToken, loadSession, getMyBookings); //내 예약만 불러오기
router.get("/:id", verifyFirebaseToken, loadSession, getBookingById); //특정 예약 조회
router.delete("/:id", verifyFirebaseToken, loadSession, deleteBooking); //예약 삭제
//router.put("/:id", verifyFirebaseToken, loadSession, updateBooking); //예약 수정


export default router;
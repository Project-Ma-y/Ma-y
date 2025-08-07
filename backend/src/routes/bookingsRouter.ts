import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { createBooking, getAllBookings, getMyBookings, getBookingById } from "../controllers/bookingsController";
import { loadSession } from "../middleware/sessionMiddleware";

const router = Router();

router.post("/", verifyFirebaseToken, loadSession, createBooking); //새 예약
router.get("/admin", verifyFirebaseToken, loadSession, getAllBookings) //예약 전체 불러오기, 관리자용
router.get("/my", verifyFirebaseToken, loadSession, getMyBookings) //내 예약만 불러오기
router.get("/:id", verifyFirebaseToken, loadSession, getBookingById) //특정 예약 조회


export default router;
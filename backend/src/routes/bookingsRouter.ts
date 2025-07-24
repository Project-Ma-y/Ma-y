import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware";
import { createBooking, getAllBookings, getMyBookings, getBookingById } from "../controllers/bookingsController";

const router = Router();

router.post("/bookings", verifyFirebaseToken, createBooking); //새 예약
router.get("/admin/bookings", verifyFirebaseToken, getAllBookings) //예약 전체 불러오기, 관리자용
router.get("/bookings/:id", verifyFirebaseToken, getBookingById) //특정 예약 조회
router.get("/my/reservations", verifyFirebaseToken, getBookingById) //내 예약만 불러오기


export default router;
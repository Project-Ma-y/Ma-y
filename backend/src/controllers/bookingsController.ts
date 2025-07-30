// controllers/bookingController.ts
import { Request, Response } from "express";
import { createBookingService, getAllBookingsService, getBookingByIdService, getMyBookingsService } from "../services/bookingService";
import { updateBookingCompletion } from "./sessionsController";
import { getUserById } from "../services/usersService";
import { Timestamp } from "firebase/firestore";
import { BookingPayload } from "../interfaces/booking";

//예약하기
export const createBooking = async (req: Request, res: Response) => {
  try {
    //예약 생성
    const userId = req.sessionData?.userId;
    const userData = await getUserById(userId);
    const userType = userData.role;
    const bookingPayload: Partial<BookingPayload>= {
      userId,
      date: req.body.date,
      place: req.body.place,
      userType: userType,
      status: "pending",
      timestamp: Timestamp.now(),

      price: req.body.price,
      isPaid: true,
    };
    const result = await createBookingService(bookingPayload);

    //세션에 저장
    await updateBookingCompletion(req, res);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "예약 생성 실패", message: error.message });
  }
};

//예약 전체 조회
export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await getAllBookingsService();
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: "전체 예약 불러오기 실패", message: error.message });
  }
};

//특정 예약 조회
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const booking = await getBookingByIdService(bookingId);
    if (!booking) res.status(404).json({ error: "예약을 찾을 수 없습니다." });
    else res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: "예약 조회 실패", message: error.message });
  }
};

//내 예약 보기
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.sessionData?.userId;
    if(!userId){
      res.status(400).json({ error: "유저 정보가 없습니다."});
    }

    const bookings = await getMyBookingsService(userId);
    if (!bookings) res.status(404).json({ error: "예약을 찾을 수 없습니다." });
    else res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: "내 예약 조회 실패", message: error.message });
  }
};

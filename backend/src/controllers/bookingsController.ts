// controllers/bookingController.ts
import { Request, Response } from "express";
import { createBookingService, getAllBookingsService, getBookingByIdService, getMyBookingsService } from "../services/bookingService";
import { updateBookingCompletion } from "./sessionsController";

//예약하기
export const createBooking = async (req: Request, res: Response) => {
  try {
    //예약 생성
    const userId = req.sessionData?.userId;
    const result = await createBookingService({ ...req.body, userId });

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
    const { id } = req.params;
    const booking = await getBookingByIdService(id);
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
      res.status(400).json({ error: ""})
    }

    const bookings = await getMyBookingsService(userId);
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: "내 예약 조회 실패", message: error.message });
  }
};

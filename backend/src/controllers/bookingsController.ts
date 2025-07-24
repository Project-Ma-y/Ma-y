// controllers/bookingController.ts
import { Request, Response } from "express";
import { createBookingService, getAllBookingsService, getBookingByIdService, getMyBookingsService } from "../services/bookingService";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.params.uid;
    const result = await createBookingService({ ...req.body, userId });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "예약 생성 실패", message: error.message });
  }
};

export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await getAllBookingsService();
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: "전체 예약 불러오기 실패", message: error.message });
  }
};

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

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.params.uid;
    const bookings = await getMyBookingsService(userId);
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: "내 예약 조회 실패", message: error.message });
  }
};

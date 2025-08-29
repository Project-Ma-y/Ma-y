// controllers/bookingController.ts
import { Request, Response } from "express";
import { createBookingService, getAllBookingsService, getBookingByIdService, getMyBookingsService, updateBookingService } from "../services/bookingService";
import { updateBookingCompletion } from "./sessionsController";
import { getUserByUIDService } from "../services/usersService";
import { BookingPayload } from "../interfaces/booking";

// 업데이트 가능한 필드
const UPDATE_ALLOWED_FIELDS = [
  "name",
  "phone",
  "gender",
  "birthdate",
  "address"
];

//예약하기
export const createBooking = async (req: Request, res: Response) => {
  try {
    //예약 생성
    // 로그인한 Firebase 사용자 ID
    const userId = req.user?.uid;
    if (!userId) {
      const error: any = new Error("인증된 사용자 정보가 없습니다.");
      error.code = 401;
      throw error;
    }
    const userData = await getUserByUIDService(userId);
    const userType = userData.customerType;
    const bookingPayload: Partial<BookingPayload> = {
      userId,
      isDeleted: false,
      startBookingTime: req.body.startBookingTime,
      endBookingTime: req.body.endBookingTime,
      departureAddress: req.body.departureAddress,
      destinationAddress: req.body.destinationAddress,
      roundTrip: req.body.roundTrip,
      assistanceType: req.body.assistanceType,
      additionalRequests: req.body.additionalRequests,
      userType: userType,
      status: "pending",

      price: 0,
      isPaid: true,
    };
    const result = await createBookingService(bookingPayload);

    //세션에 저장
    await updateBookingCompletion(req, res);

    res.status(201).json(result);
  } catch (error: any) {
    const statusCode = typeof error.code === "number" ? error.code : 500;
    console.error(`[❌ 예약 in createBooking ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    if (statusCode < 500) {
      res.status(statusCode).json({
        message: "로그인 상태에 문제가 발생했습니다. 다시 시도해주세요."
      });
    }
    else res.status(statusCode).json({
      message: "서버에 문제가 발생했습니다. 나중에 다시 시도해주세요."
    });
  }
};

//예약 전체 조회
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await getAllBookingsService();
    res.status(200).json(bookings);
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 예약 in getAllBokkings ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({ message: "예약 조회 실패"});
  }
};

//특정 예약 조회
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;

    const booking = await getBookingByIdService(bookingId);
    if (!booking) {
      const error: any = new Error("예약을 찾을 수 없습니다.");
      error.code = 404;
      throw error;
    }

    res.status(200).json(booking);
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 예약 in getBookingById ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({message: "예약 조회 실패"});
  }
};

//내 예약 보기
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    // 로그인한 Firebase 사용자 ID
    const userId = req.user?.uid;
    if (!userId) {
      const error: any = new Error("인증된 사용자 정보가 없습니다.");
      error.code = 401;
      throw error;
    }

    const bookings = await getMyBookingsService(userId);
    if (!bookings) {
      const error: any = new Error("예약을 찾을 수 없습니다.");
      error.code = 404;
      throw error;
    }

    res.status(200).json(bookings);
  } catch (error: any) {
        const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 유저 in getMyBookings ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({message: "내 예약 조회 실패"});
  }
};



//예약 수정
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;

    // body에서 허용된 필드만 추출
    const payload: any = {};
    for (const field of UPDATE_ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        payload[field] = req.body[field];
      }
    }


    const booking = await updateBookingService(bookingId, req.body);

    if (!booking) {
      const error: any = new Error("예약을 찾을 수 없습니다.");
      error.code = 404;
      throw error;
    }


    res.status(200).json(booking);
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 예약 in updateBooking ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({message: "예약 수정 실패"});
  }
};

//예약 삭제
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;

    const booking = await getBookingByIdService(bookingId);
    if (!booking) {
      const error: any = new Error("예약을 찾을 수 없습니다.");
      error.code = 404;
      throw error;
    }

    res.status(200).json(booking);
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 예약 in deleteBooking ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({message: "예약 삭제 실패"});
  }
};

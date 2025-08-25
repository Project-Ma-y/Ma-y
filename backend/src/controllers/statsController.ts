// src/controllers/statsController.ts
import { Request, Response } from "express";
import { getSignupConversionService, getApplicationConversionService, getApplicationReachService } from "../services/statsService";

// 회원가입 전환율
// 회원가입 완료한 세션 id 개수 / 세션 id 개수
export const getSignupConversion = async (req: Request, res: Response) => {
  try {
    // 회원가입 전환율 계산 로직
    const data = await getSignupConversionService();
    res.status(200).json(data);
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 통계 in getSignupConversion ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({message: "회원가입 전환율 조회 실패"});
  };
};

// 동행 신청 페이지 도달율
// 동행 신청 페이지 도달 횟수가 1 이상인 id 개수 / 세션 id 개수
export const getApplicationReach = async (req: Request, res: Response) => {
  try {
    const data = await getApplicationReachService();
    res.status(200).json(data);
  } catch (error: any) {
       const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 통계 in getApplicationReach ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({message: "동행신청 도달율 조회 실패"});
  }
};

// 동행 신청 전환율
// 동행 신청 완료 회수가 1 이상인 세션 id 개수 / 세션 id 개수
export const getApplicationConversion = async (req: Request, res: Response) => {
  try {
    const data = await getApplicationConversionService();
    res.status(200).json(data);
  } catch (error: any) {
       const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 통계 in getApplicationConversion ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({message: "동행신청 전환율 조회 실패"});
  }
};

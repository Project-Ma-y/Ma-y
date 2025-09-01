import { Request, Response } from "express";
import { admin } from "../utils/firebase";
import { initSession, updateSession } from "../services/sessionService";
import { CookieOptions } from "express";


export const cookieSet: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none", // 타입상 "lax" | "strict" | "none" | boolean 허용
  domain: ".mayservice.co.kr", // ← 여기!
};

//최초 접속
export const updateLanding = async (req: Request, res: Response) => {
  try {
    //세션 존재 확인
    //세션 없을 시 생성
    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = await initSession(req.user?.uid || "");
      res.status(201).cookie("sessionId", sessionId, cookieSet).json({ message: "세션 생성 성공"});
    }
    else{
      res.status(200).json({ message: `이미 세션이 있습니다. sessionId: ${sessionId}`});
    }

  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 세션 in updateLanding ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({message: "세션 생성 오류 발생"});
  };
}

//회원가입 완료
export async function updateSignUpCompletion(req: Request, res: Response, userId: any) {
  try {
    //세션 id 쿠키에서 불러오기
    let sessionId = req.cookies.sessionId;
    const now = new Date().toISOString();

    //세션이 존재하지 않으면 생성
    if (!sessionId) {
      sessionId = await initSession(userId);
    }

    //세션 업데이트
    await updateSession(sessionId, {
      isRegistered: true, // 회원가입 완료 여부 (필수)
      registeredAt: now, // 회원가입 완료 시간 (선택)
      userId //userId
    })
  } catch (error) {
    throw new Error("세션 갱신 실패 in updateSignUpCompletion");
  }
}

//동행 신청 페이지 도달
export async function updateBookingPage(req: Request, res: Response) {
  try {
    //세션 id 쿠키에서 불러오기
    let sessionId = req.cookies.sessionId;
    const now = new Date().toISOString();

    //세션이 존재하지 않으면 생성
    if (!req.user || !req.user.uid) {
      throw new Error("로그인 정보가 존재하지 않습니다.");
    }
    if (!sessionId) {
      const uid = req.user?.uid;
      sessionId = await initSession(uid);
    }

    //세션 업데이트
    await updateSession(sessionId, {
      visitApplyPageCount: admin.firestore.FieldValue.increment(1), // 동행 신청 페이지 도달 횟수 (필수)
      lastVisitApplyPageAt: now // 최근 도달 시간
    })

    res.status(200).json({ message: "세션 업데이트 완료"});
  } catch (error: any) {
    const statusCode = typeof error.code === "number" ? error.code : 500;
    console.error(`[❌ 세션 업데이트 in updateBookingPage ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });
    res.status(statusCode).json({message:"세션 생성 오류 발생"});
  }
}

//동행 신청 완료
export async function updateBookingCompletion(req: Request, res: Response) {
  try {
    //세션 id 쿠키에서 불러오기
    let sessionId = req.cookies.sessionId;
    const now = new Date().toISOString();

    //세션이 존재하지 않으면 생성
    if (!req.user || !req.user.uid) {
      throw new Error("로그인 정보 없음 in updateBookingCompletion");
    }
    if (!sessionId) {
      const uid = req.user.uid;
      sessionId = await initSession(uid);
    }

    //세션 업데이트
    await updateSession(sessionId, {
      applyCount: admin.firestore.FieldValue.increment(1),
      lastApplyAt: now
    });
  } catch (error: any) {
    throw new Error("세션 갱신 실패 in updateBookingCompletion");
  }
}


//쿠키 읽기 테스트용
export async function readCookie(req: Request, res: Response) {
  try {
    const cookie = req.cookies.sessionId;
    res.json(cookie);
  } catch (error) {
    res.status(500).json({ error: "쿠키 읽기 실패", message: (error as Error).message });
  }
}
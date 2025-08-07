import { Request, Response } from "express";
import { admin } from "../utils/firebase";
import { initSession, updateSession } from "../services/sessionService";

//최초 접속
export const updateLanding = async (req: Request, res: Response) => {
  try {
    //세션 존재 확인
    //세션 없을 시 생성
    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = await initSession(req.user?.uid || "");
      res.cookie("sessionId", sessionId, { httpOnly: true, secure: false, sameSite: "lax" });
    }

  } catch (error) {
    res.status(500).json({ error: "세션 생성 실패", message: (error as Error).message });
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
    res.status(500).json({ error: "세션 갱신 실패", message: (error as Error).message });
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
      res.status(401).json({ error: "로그인 정보 없음" });
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

    res.status(200).json({ message: "세션 업데이트 완"});
  } catch (error) {
    res.status(500).json({ error: "세션 갱신 실패", message: (error as Error).message });
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
      return res.status(401).json({ error: "로그인 정보 없음" });
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
  } catch (error) {
    res.status(500).json({ error: "세션 갱신 실패", message: (error as Error).message });
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
import { Request, Response, NextFunction } from "express";
import { db } from "../utils/firebase";
import { initSession } from "../services/sessionService";
import { cookieSet } from "../controllers/sessionsController";

const isProduction = process.env.NODE_ENV === "production";
const skipPaths = ["/api/sessions/main"];

// 요청에서 프론트 도메인 판별 (Origin 우선, 없으면 Host 보조)
function isTestRequest(req: Request): boolean {
  const origin = (req.get("origin") || req.get("referer") || "").toLowerCase();
  if (origin.includes("://test.mayservice.co.kr")) return true;

  // 혹시 API도 test 서브도메인으로 직접 붙는 경우 대비
  const xfHost = (req.headers["x-forwarded-host"] as string | undefined)?.split(",")[0]?.trim().toLowerCase();
  const host = (xfHost || req.headers.host || req.hostname || "").toLowerCase();
  return host.startsWith("test.mayservice.co.kr");
}


export const loadSession = async (req: Request, res: Response, next: NextFunction) => {
  let sessionId = req.cookies.sessionId;

  //스킵 경로 처리
  if(skipPaths.includes(req.path)){
    next();
  }

  //테스트 서버인지 분리
  const isTest = isTestRequest(req);
  const collectionName = isTest ? "testSessions" : "sessions";

  if (!sessionId){
    console.log("loadSession에서 세션id 못찾음"); //test
    sessionId = await initSession(req.user?.uid || "");
    req.cookies.sessionId = sessionId;
    res.cookie("sessionId", sessionId, cookieSet);
  }

  //세션 못 찾을 시 생성
  let sessionRef = await db.collection("sessions").doc(sessionId);
  let doc = await sessionRef.get();
  if (!doc.exists){
    console.log("loadSession에서 doc 쿠키 못찾음"); //test
    sessionId = await initSession(req.user?.uid || "");
    req.cookies.sessionId = sessionId;
    sessionRef = await db.collection(collectionName).doc(sessionId);
    doc = await sessionRef.get();
    res.cookie("sessionId", sessionId, cookieSet);
  }

  req.sessionData= doc.data();
  req.sessionRef = sessionRef;
  next();
};


// 미들웨어: 이 라우트만 캐시 금지 + ETag 끄기
export const noCache = async (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  // ETag 비활성화: 이 응답에 대해선 생성하지 않게
  res.removeHeader("ETag");
  next();
};
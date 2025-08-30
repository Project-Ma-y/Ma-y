import { Request, Response, NextFunction } from "express";
import { db } from "../utils/firebase";
import { initSession } from "../services/sessionService";

const isProduction = process.env.NODE_ENV === "production";
const skipPaths = ["/api/sessions/main"];

// 공통 쿠키 옵션 (반드시 동일하게)
export const sessionCookieOpts = {
  httpOnly: true,
  secure: true,                 // SameSite=None이면 secure 필수. 프로덕션 강제 권장
  sameSite: "none" as const,    // app.<domain> ↔ api.<domain> 크로스 서브도메인 대응
  domain: ".mayservice.co.kr", // API 호스트에만 붙이고 싶으면 생략 가능. 서브도메인 전체 공유는 domain: ".mayservice.co.kr"
};

export const loadSession = async (req: Request, res: Response, next: NextFunction) => {
  let sessionId = req.cookies.sessionId;

  if(skipPaths.includes(req.path)){
    next();
  }
  else
  {//console.log("loadSession 시작"); //test
  //console.log(sessionId);
  // 세션id 없으면 생성
  if (!sessionId){
    console.log("loadSession에서 세션id 못찾음"); //test
    sessionId = await initSession(req.user?.uid || "");
    req.cookies.sessionId = sessionId;
    res.cookie("sessionId", sessionId, sessionCookieOpts);
  }

  //세션 못 찾을 시 생성
  let sessionRef = await db.collection("sessions").doc(sessionId);
  let doc = await sessionRef.get();
  if (!doc.exists){
    console.log("loadSession에서 doc 쿠키 못찾음"); //test
    sessionId = await initSession(req.user?.uid || "");
    req.cookies.sessionId = sessionId;
    sessionRef = await db.collection("sessions").doc(sessionId);
    doc = await sessionRef.get();
    res.cookie("sessionId", sessionId, sessionCookieOpts);
  }

  req.sessionData= doc.data();
  req.sessionRef = sessionRef;
  next();}
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
import { Request, Response, NextFunction } from "express";
import { db } from "../utils/firebase";
import { initSession } from "../services/sessionService";

const isProduction = process.env.NODE_ENV === "production";
const skipPaths = ["/api/sessions/main"];

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
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: isProduction, sameSite: "none" });
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
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: isProduction, sameSite: "none" });
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
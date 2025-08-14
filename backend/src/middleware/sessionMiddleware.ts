import { Request, Response, NextFunction } from "express";
import { db } from "../utils/firebase";
import { initSession } from "../services/sessionService";

const skipPaths = ["/api/sessions/main"];

export const loadSession = async (req: Request, res: Response, next: NextFunction) => {
  let sessionId = req.cookies.sessionId;

  //console.log("loadSession 시작"); //test
  //console.log(sessionId);
  // 세션id 있고, 스킵패스임 => 그럼 init생성 x
  // 세션 id 있고, 스킵패스가 아님 => 그럼 init 생성x
  // 세션 id 없고, 스킵패스임  => 그럼 init 생성x
  // 세션 id 없고,  스킵패스가 아님 => 그럼 init 생성
  if (!sessionId && !skipPaths.includes(req.path)){
    console.log("loadSession에서 세션id 못찾음"); //test
    sessionId = await initSession(req.user?.uid || "");
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: true, sameSite: "none" }); //test
  }

  //세션 못 찾을 시 생성
  let sessionRef = await db.collection("sessions").doc(sessionId);
  let doc = await sessionRef.get();
  if (!doc.exists){
    console.log("loadSession에서 doc 쿠키 못찾음"); //test
    sessionId = await initSession(req.user?.uid || "");
    sessionRef = await db.collection("sessions").doc(sessionId);
    doc = await sessionRef.get();
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: true, sameSite: "none" }); //test
  }

  req.sessionData= doc.data();
  req.sessionRef = sessionRef;
  next();
};

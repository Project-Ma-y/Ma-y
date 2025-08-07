import { Request, Response, NextFunction } from "express";
import { db } from "../utils/firebase";
import { initSession } from "../services/sessionService";


export const loadSession = async (req: Request, res: Response, next: NextFunction) => {
  let sessionId = req.cookies.sessionId;

  //console.log("loadSession 시작"); //test
  //console.log(sessionId);
  //세션 없을 시 생성
  if (!sessionId){
    console.log("loadSession에서 세션id 못찾음"); //test
    sessionId = await initSession(req.user?.uid || "");
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: false, sameSite: "lax" }); //test
  }

  //세션 못 찾을 시 생성
  let sessionRef = await db.collection("sessions").doc(sessionId);
  let doc = await sessionRef.get();
  if (!doc.exists){
    console.log("loadSession에서 doc 쿠키 못찾음"); //test
    sessionId = await initSession(req.user?.uid || "");
    sessionRef = await db.collection("sessions").doc(sessionId);
    doc = await sessionRef.get();
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: false, sameSite: "lax" }); //test
  }

  req.sessionData= doc.data();
  req.sessionRef = sessionRef;
  next();
};

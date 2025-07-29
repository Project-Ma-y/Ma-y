import { Request, Response, NextFunction } from "express";
import { db } from "../utils/firebase";
import { initSession } from "../services/sessionService";


export const loadSession = async (req: Request, res: Response, next: NextFunction) => {
  let sessionId = req.cookies.sessionId;

  //세션 없을 시 생성
  if (!sessionId){
    sessionId = await initSession(req.user?.uid || "");
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: true, sameSite: "strict" });
  }

  //세션 못 찾을 시 생성
  let sessionRef = db.collection("sessions").doc(sessionId);
  let doc = await sessionRef.get();
  if (!doc.exists){
    sessionId = await initSession(req.user?.uid || "");
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: true, sameSite: "strict" });
    sessionRef = db.collection("sessions").doc(sessionId);
    doc = await sessionRef.get();
  }

  req.sessionData= doc.data();
  req.sessionRef = sessionRef;
  next();
};

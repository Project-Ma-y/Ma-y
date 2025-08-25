import { Request, Response, NextFunction } from "express";

// env에 저장한 값 불러오기
const allowedAdminUids = (process.env.ALLOWED_ADMIN_UIDS ?? "").split(",");

export function checkAdminUid(req: Request, res: Response, next: NextFunction) {
  const UID = req.user?.uid;

  if (!UID) {
    res.status(400).json({ error: "아이디가 필요합니다." });
    return;
  }

  // 화이트리스트 검사
  if (!allowedAdminUids.includes(UID)) {
    res.status(403).json({ error: "허용되지 않은 관리자 이메일입니다." });
    return;
  }

  next();
}

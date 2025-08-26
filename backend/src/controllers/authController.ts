import { Request, Response } from "express";
import { registerParentService, registerUser } from '../services/authService'
import { getUserByIdService, updateUserService, getUserByUIDService } from "../services/usersService";
import { validateRegisterPayload } from "../validators/registerValidator";
import { updateSignUpCompletion } from "./sessionsController";

const allowedAdminUids = (process.env.ALLOWED_ADMIN_UIDS ?? "").split(",");

// 회원가입 컨트롤러
// 작성자 김다영
// 2025.07.02
export const registerHandler = async (req: Request, res: Response) => {
  try {
    //유효성 검사
    const errors = validateRegisterPayload(req.body);
    if (errors.length > 0) {
      const error: any = new Error(errors.join(" / "));
      error.code = 400;
      throw error;
    }

    const exists = await getUserByIdService(req.body.id);
    let user;

    //기존 DB에 존재하는 지 확인
    if (exists) {
      user = await updateUserService(req.body);
    }
    else {
      //DB에 등록
      user = await registerUser(req.body);
    }

    //세션 업데이트
    await updateSignUpCompletion(req, res, user.uid);

    res.status(201).json({ uid: user.uid, message: '회원가입 성공' });

  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 회원가입 in registerHandler ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({
      message: "서버에 문제가 발생했습니다. 나중에 다시 시도해주세요."
    });
  }
};

//테스트용 컨트롤러
export const testAuth = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: '테스트 성공' });
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 502;

    console.error(`[❌ 인증 테스트 in testAuth ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({
      message: "서버에 문제가 발생했습니다. 나중에 다시 시도해주세요."
    });
  }
}

//관리자 확인
export const adminCheck = async (req: Request, res: Response) => {
  try {
    const uid = (req as any).user?.uid; // verifyFirebaseToken에서 채워넣음

    if (!uid) {
      res.status(401).json({ error: "인증되지 않은 사용자입니다." });
      return;
    }
    const isAdmin = allowedAdminUids.includes(uid);

    res.status(200).json({ isAdmin })
  }
  catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 인증 in adminCheck ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({
      message: "서버에 문제가 발생했습니다. 나중에 다시 시도해주세요."
    });
  }
}

//부모 등록
export const registerParent = async (req: Request, res: Response) => {
  try {
    // 부모 정보 배열 처리
    const parents = Array.isArray(req.body) ? req.body : [req.body];

    if (parents.length === 0) {
      const error: any = new Error("부모 정보가 없습니다.");
      error.code = 400;
      throw error;
    }

    // 부모 등록 (Promise.all)
    const results = await Promise.all(
      parents.map(async (parent) => {
        return await registerParentService(parent);
      })
    );

    // 현재 로그인한 가족 유저 찾기
    const family = await getUserByUIDService(req.user?.uid);
    if (!family) {
      const error: any = new Error("해당 가족 유저를 찾을 수 없습니다.");
      error.code = 404;
      throw error;
    }

    // registeredFamily 배열 생성
    const registeredFamily = results.map((parentCredential, idx) => ({
      uid: parentCredential.uid,
      name: parentCredential.displayName,
      relation: parents[idx].relation,
      linkedAt: new Date().toISOString(),
    }));

    // 가족 정보 업데이트
    await updateUserService({
      id: family.id,
      registeredFamily
    });

    res.status(201).json({ message: '등록 성공' });

  } catch (error: any) {
    const statusCode = typeof error.code === "number" ? error.code : 500;

    console.error(`[❌ 부모 등록 in registerParent ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown",
    });

    res.status(statusCode).json({
      message: "서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.",
    });
  }
};
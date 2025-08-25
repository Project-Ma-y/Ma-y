import { Request, Response } from "express";
import { registerUser } from '../services/authService'
import { validateRegisterPayload } from "../validators/registerValidator";
import { updateSignUpCompletion } from "./sessionsController";


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

    //DB에 등록
    const user = await registerUser(req.body);

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
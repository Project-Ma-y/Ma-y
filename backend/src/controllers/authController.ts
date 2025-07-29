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

  } catch (err: any) {
    const statusCode = typeof err.code === 'number' ? err.code : 500;
    res.status(statusCode).json({
      message: err.message || '회원가입 실패',
      error: err.stack,
    });
  }
};

//테스트용 컨트롤러
export const testAuth = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: '테스트 성공' });
  } catch (err: any) {
    const statusCode = typeof err.code === 'number' ? err.code : 502;
    res.status(statusCode).json({
      message: err.message || '테스트 실패',
      error: err.stack,
    });
  }
}
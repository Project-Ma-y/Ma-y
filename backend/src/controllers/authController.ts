import { Request, Response } from "express";
import { registerUser } from '../services/authService'
import { validateRegisterPayload } from "../validators/registerValidator";


// 회원가입 컨트롤러
// 작성자 김다영
// 2025.07.02
export const registerHandler = async (req: Request, res: Response) => {
  try {
    //유효성 검사
    const errors = validateRegisterPayload(req.body);
    if(errors.length > 0){
      const error: any = new Error(errors.join(" / "));
      error.code = 400;
      throw error;
    }

    //DB에 등록
    const user = await registerUser(req.body);
    res.status(201).json({ uid: user.uid, message: '회원가입 성공' });
  } catch (err: any) {
    const statusCode = typeof err.code === 'number' ? err.code : 500;
    res.status(statusCode).json({
      message: err.message || '회원가입 실패',
      error: err.stack,
    });
  }
};

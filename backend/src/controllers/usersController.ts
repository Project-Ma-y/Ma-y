import { Request, Response } from "express";
import { registerUser } from '../services/usersService'

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const requiredFields = ['id', 'email', 'password', 'name', 'phoneNumber', 'role'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        res.status(400).json({ message: `${field}는 필수입니다.` });
        return;
      }
    }

    const user = await registerUser(req.body);
    res.status(201).json({ uid: user.uid, message: '회원가입 성공' });
  } catch (err: any) {
    const statusCode = err.code === 409 ? 409 : 500;
    res.status(statusCode).json({
      message: err.message || '회원가입 실패',
      error: err.stack,
    });
  }
};

import { Request, Response } from "express";
import { getAllUsersService, getUserByUIDService, deleteUserService, updateUserService, updateUserServiceUID, compareUserPassword } from "../services/usersService";
import { REPLCommand } from "repl";

// 업데이트 가능한 필드
const UPDATE_ALLOWED_FIELDS = [
  "name",
  "phone",
  "gender",
  "birthdate",
  "address",
  "registeredFamily",
];

const PASSWORD_ALLOWED_FIELDS = [
    "password"
]


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 유저 in getAllUsers ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({ message: "가입자 목록 조회 실패" });
  }
};

export const getUserByUID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserByUIDService(id);
    res.status(200).json(user);
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 유저 in getUserById ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({ message: "유저 정보 찾기 실패" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUserService(id);
    res.status(200).json({ message: "회원 삭제 성공" });
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 유저 in deleteUser ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({ message: "유저 삭제 실패" });
  }
};

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.sessionData?.userId || req.user?.uid;

    if (!userId) {
      res.status(401).json({ error: "로그인이 필요합니다." });
      return;
    }

    const user = await getUserByUIDService(userId);

    res.status(200).json(user);
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 유저 in getMyProfile ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({ message: "유저 정보 가져오기 실패" });
  }
}

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // uid 불러오기
    const uid = req.user?.uid;
    if (!uid) {
      const error: any = new Error("로그인이 필요합니다.");
      error.code = 401;
      throw error;
    }

    // body에서 허용된 필드만 추출
    const payload: any = {};
    for (const field of UPDATE_ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        payload[field] = req.body[field];
      }
    }

    await updateUserServiceUID(uid, payload);

    res.status(200).json({ message: "회원 업데이트 성공" });
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 유저 in updateUser ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({ message: "유저 정보 업데이트 실패" });
  }
}


export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    // uid 불러오기
    const uid = req.user?.uid;
    if (!uid) {
      const error: any = new Error("로그인이 필요합니다.");
      error.code = 401;
      throw error;
    }

    // body에서 허용된 필드만 추출
    const payload: any = {};
    for (const field of PASSWORD_ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        payload[field] = req.body[field];
      }
    }

    //password면 기존 비밀번호와 대조하는 과정을 거칠 것
    if (req.body.currentPassword) {
      await compareUserPassword(uid, payload, req.body.currentPassword);
    }
    else{
      const error: any = new Error("바꿀 비밀번호를 입력해주세요.");
      error.code = 400;
      throw error;
    }

    await updateUserServiceUID(uid, payload);

    res.status(200).json({ message: "회원 업데이트 성공" });
  } catch (error: any) {
    const statusCode = typeof error.code === 'number' ? error.code : 500;

    console.error(`[❌ 유저 in updateUser ${req.method} ${req.originalUrl}]`, {
      statusCode,
      message: error.message,
      stack: error.stack,
      user: req.sessionData?.userId || "unknown"
    });

    res.status(statusCode).json({ message: "유저 정보 업데이트 실패" });
  }
}
import { doc, setDoc, DocumentReference } from "firebase/firestore";
const admin = require("firebase-admin");
import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";
import { auth, db } from '../utils/firebase'
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { mayEmail } from "./authService";
import { RegisterPayload } from "../interfaces/auth";

const USER_COLLECTION = "users"
const collectionRef = db.collection(USER_COLLECTION);

export const getUserByUIDService = async (userId: any) => {
  try {
    if (!userId) {
      throw new Error("userId가 존재하지 않습니다");
    }

    const userData = await collectionRef.doc(userId).get();
    if (userData.exists) {
      return userData.data();
    }
    else throw new Error("userData가 존재하지 않습니다")
  } catch (error) {
    console.error("❌ 유저 정보 찾기 실패:", error);
    throw new Error("유저 정보 찾는 중 오류 발생");
  }
}

export const getAllUsersService = async () => {
  try {
    const snapshot = await collectionRef.get();
    if (snapshot.empty) {
      const error = new Error("유저 데이터가 없습니다");
      (error as any).code = 404;
      throw error;
    }

    const users = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    console.error("❌ 전체 유저 조회 실패:", error);
    throw error;
  }
}

export const deleteUserService = async (userId: string) => {
  try {
    if (!userId) {
      const error = new Error("userId가 존재하지 않습니다");
      (error as any).code = 400;
      throw error;
    }

    // Firebase Auth에서 삭제
    await admin.auth().deleteUser(userId);

    // Firestore에서 삭제
    //await collectionRef.doc(userId).delete();
    await db.collection("users").doc(userId).update({
      isDeleted: true,
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { message: "유저 삭제 성공" };
  } catch (error) {
    console.error("❌ 유저 삭제 실패:", error);
    throw error;
  }
}

export const getUserByIdService = async (id: any) => {
  try {
    if (!id) {
      throw new Error("Id가 존재하지 않습니다");
    }

    const email = `${id}${mayEmail}`; // id + 이메일 도메인 결합
    //파이어베이스에서 검색
    const userData = await admin.auth().getUsers([{ email }]);
    // 사용자 존재 여부 확인
    if (userData.users.length > 0) {
      return userData.users[0]; // 첫 번째 사용자 반환
    } else {
      return false;
    }
  } catch (error) {
    console.error("❌ 유저 정보 찾기 실패:", error);
    throw new Error("유저 정보 찾는 중 오류 발생");
  }
}


export const updateUserService = async (payload: Partial<RegisterPayload>) => {
  try {
    if (!payload || !payload.id) {
      throw new Error("정보가 존재하지 않습니다");
    }

    const userRecord = await getUserByIdService(payload.id);
    // uid 찾기
    let userId;
    if (userRecord) userId = userRecord.uid;


    // Firebase Auth 정보 업데이트 (password나 name만 변경될 때만)
    const updateAuthPayload: any = {};
    if (payload.password) updateAuthPayload.password = payload.password;
    if (payload.name) updateAuthPayload.displayName = payload.name;

    if (Object.keys(updateAuthPayload).length > 0) {
      await auth.updateUser(userId, updateAuthPayload);
    }

    //유저 정보 users에 업데이트
    await db.collection("users").doc(userId).update(payload);

    return userRecord;
  } catch (error) {
    console.error('Error updating user in updateUserService:', error);
    throw error;
  }
}



export const updateUserServiceUID = async (userId: string, payload: Partial<RegisterPayload>) => {
  try {
    if (!payload || !userId) {
      throw new Error("정보가 존재하지 않습니다");
    }
    // Firebase Auth 정보 업데이트 (password나 name만 변경될 때만)
    const updateAuthPayload: any = {};
    if (payload.password) updateAuthPayload.password = payload.password;
    if (payload.name) updateAuthPayload.displayName = payload.name;

    if (Object.keys(updateAuthPayload).length > 0) {
      await auth.updateUser(userId, updateAuthPayload);
    }

    //유저 정보 users에 업데이트
    const userRecord = await db.collection("users").doc(userId).update(payload);

    return userRecord;
  } catch (error) {
    console.error('Error updating user in updateUserService:', error);
    throw error;
  }
}

export const compareUserPassword = async (userId: string, payload: Partial<RegisterPayload>, currentPassword: string) => {
  try {
    if (!payload || !userId) {
      throw new Error("정보가 존재하지 않습니다");
    }
    if (!currentPassword) {
      const err = new Error("비밀번호 변경 시 현재 비밀번호를 입력해야 합니다.");
      (err as any).code = 401;
      throw err;
    }

    // Firestore에서 기존 사용자 데이터 불러오기
    const userDocRef = db.collection("users").doc(userId);
    const userSnapshot = await userDocRef.get();
    if (!userSnapshot.exists) {
      const error: any = new Error("사용자를 찾을 수 없습니다.");
      error.code = 404;
      throw error;
    }

    const currentUserData = userSnapshot.data();

    //검증
    if (payload.password) {
      const isPasswordCorrect = currentPassword === currentUserData?.password;

      if (!isPasswordCorrect) {
        const err = new Error("현재 비밀번호가 일치하지 않습니다.");
        (err as any).code = 402;
        throw err;
      }

    }
    return true;

  } catch (error) {
    console.error('Error updating user in compareUserPassword:', error);
    throw error;
  }
}
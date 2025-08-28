// src/services/firebaseAuth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase"; // firebase.ts에서 이미 초기화된 인증 인스턴스를 가져옵니다.

// 이메일 및 비밀번호로 로그인
export const loginWithFirebase = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    let errorMessage = "로그인에 실패했습니다. 다시 시도해 주세요.";
    const code = error.code;
    if (code === "auth/invalid-credential") {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
    } else if (code === "auth/user-not-found") {
        errorMessage = "존재하지 않는 계정입니다.";
    } else if (code === "auth/too-many-requests") {
        errorMessage = "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
    }
    throw new Error(errorMessage);
  }
};

// 이메일 및 비밀번호로 회원가입
export const signUpWithFirebase = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// 로그아웃
export const signOutUser = () => {
  return signOut(auth);
};

import { doc, setDoc } from "firebase/firestore";
const admin = require("firebase-admin");
import { auth, db, USER_COLLECTION } from '../utils/firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";

export const registerUser = async (
  payload: {
    id: string,
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    role: 'guardian' | 'companion',
    registeredParents: string[]
  }) => {
  try {
     // 중복 검사: email 기준
    const snapshot = await db.collection("users")
      .where("email", "==", payload.email)
      .get();

    if (!snapshot.empty) {
      const error: any = new Error("이미 등록된 이메일입니다.");
      error.code = 409;
      throw error;
    }

    //유저 생성
    const user = await db.collection("users").doc().set({
      id: payload.id,
      email: payload.email,
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      role: payload.role, //guardian or companion
      registeredParents: payload.registeredParents,
      createdAt: Date.now(),
      updatedAt: Date.now()
  });

    return user;
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error;
  }
};
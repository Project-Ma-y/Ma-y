import { doc, setDoc, DocumentReference } from "firebase/firestore";
const admin = require("firebase-admin");
import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";
import { auth, db } from '../utils/firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";

const USER_COLLECTION = "users"
const collectionRef = db.collection(USER_COLLECTION);

export const getUserByIdService = async (userId: any) => {
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

export const deleteUserService = async (userId: any) => {
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

export const updateUserInfo = async () => {

}
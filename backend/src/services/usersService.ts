import { doc, setDoc } from "firebase/firestore";
const admin = require("firebase-admin");
import { auth, db } from '../utils/firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";

const USER_COLLECTION = "users"
const collectionRef = db.collection(USER_COLLECTION);

export const getUserById = async (userId: any) => {
    try {
        if (!userId) {
            throw new Error("userId가 존재하지 않습니다");
        }

        const userData = await collectionRef.doc(userId).get();
        if(userData.exists){
            return userData.data();
        }
        else throw new Error("userData가 존재하지 않습니다")
    } catch (error) {
        console.error("❌ 유저 정보 찾기 실패:", error);
        throw new Error("유저 정보 찾는 중 오류 발생");
    }
}

export const updateUserInfo = async () => {

}
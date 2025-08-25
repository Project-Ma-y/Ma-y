import { doc, setDoc } from "firebase/firestore";
const admin = require("firebase-admin");
import { auth, db } from '../utils/firebase'
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { RegisterPayload } from "../interfaces/auth";

// 회원가입: 회원정보 db 등록
// 작성자 김다영
// 2025.07.02
export const registerUser = async (
    payload: RegisterPayload) => {
    try {
        // 중복 검사: email 기준
        // const snapshot = await db.collection("users")
        //     .where("email", "==", payload.email)
        //     .get();

        // if (!snapshot.empty) {
        //     const error: any = new Error("이미 등록된 이메일입니다.");
        //     error.code = 409;
        //     throw error;
        // }

        // 파이어베이스 회원가입
        const credential = await auth.createUser({
            email: payload.email,
            password: payload.password,
            displayName: payload.name
        })

        //유저 정보 users에 저장
        await db.collection("users").doc(credential.uid).set({
            isDeleted: false,
            customerType: payload.customerType,            
            email: payload.email,
            password: payload.password,
            name: payload.name,
            phone: payload.phone,
            gender: payload.gender,
            address: payload.address,
            birthdate: payload.birthdate,

            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        return credential;
    } catch (error) {
        console.error('Error creating new user in registerUser:', error);
        throw error;
    }
};

// 로그인 함수
// 작성자 김다영
// export const loginUser = async (
//     payload: {
//         id: string,
//         password: string,
//     }) => {
//     try {
//         // 로그인
//         // id 찾기
//         const user = await db.collection("users")
//             .where("id", "==", payload.id)
//             .get();
        

//         // id가 없으면
//         if (user.empty) {
//             const error: any = new Error("id를 찾을 수 없습니다.");
//             error.code = 409;
//             throw error;
//         }

//         //비밀번호 비교
//         if (user.password !== payload.password) {
//             const error: any = new Error("비밀번호가 일치하지 않습니다.");
//             error.code = 409;
//             throw error;
//         }

//         return user;
//     } catch (error) {
//         console.error('Error login:', error);
//         throw error;
//     }
// };
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app);

// 로그인 처리 함수
export const loginWithFirebase = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("로그인 성공:", user);
        return user;
    } catch (error) {
        // 오류 상세 정보를 파싱하여 사용자에게 더 유용한 메시지를 제공합니다.
        console.error("Firebase 로그인 오류:", error.code, error.message);
        let errorMessage = "로그인에 실패했습니다. 다시 시도해 주세요.";
        if (error.code === 'auth/invalid-credential') {
            errorMessage = "잘못된 이메일 또는 비밀번호입니다.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "이메일 주소의 형식이 유효하지 않습니다.";
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = "이 계정은 비활성화되었습니다.";
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = "여러 차례 로그인 실패로 인해 이 계정에 대한 접근이 일시적으로 차단되었습니다. 나중에 다시 시도해 주세요.";
        }
        throw new Error(errorMessage);
    }
};

// 로그아웃 처리 함수
export const logoutWithFirebase = async () => {
    try {
        await signOut(auth);
        console.log("로그아웃 성공");
    } catch (error) {
        console.error("로그아웃 실패:", error);
    }
};

// 회원가입 처리 함수
export const registerWithFirebase = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("회원가입 성공:", user);
        return user;
    } catch (error) {
        console.error("Firebase 회원가입 오류:", error.code, error.message);
        let errorMessage = "회원가입에 실패했습니다. 다시 시도해 주세요.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "이미 사용 중인 이메일입니다.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "비밀번호는 최소 6자 이상이어야 합니다.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "이메일 주소의 형식이 유효하지 않습니다.";
        }
        throw new Error(errorMessage);
    }
};

// 사용자 인증 상태 리스너 설정
export const initializeAuthListener = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // 사용자가 로그인했습니다.
            console.log("Firebase 인증 상태 변화: 사용자가 로그인되었습니다.", user.uid);
        } else {
            // 사용자가 로그아웃되었습니다.
            console.log("Firebase 인증 상태 변화: 사용자가 로그아웃되었습니다.");
        }
    });
};


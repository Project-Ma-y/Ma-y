import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, type Auth, type User } from "firebase/auth";
import { useUserStore } from "@/store/userStore";

// Your web app's Firebase configuration
const firebaseConfig = {
            apiKey: "AIzaSyALislKfX7MQeh1IteqWiiaxYGJ_KrNZN4",
            authDomain: "ma-y-b1fa6.firebaseapp.com",
            databaseURL: "https://ma-y-b1fa6-default-rtdb.firebaseio.com",
            projectId: "ma-y-b1fa6",
            storageBucket: "ma-y-b1fa6.firebasestorage.app",
            messagingSenderId: "48645617538",
            appId: "1:48645617538:web:23d556cdd2c5b223b2019b",
            measurementId: "G-8CPE7B7PLN",
        };

// Initialize Firebase
export const app = initializeApp(firebaseConfig); // 'export' 키워드 추가

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);

// This function listens for auth state changes and updates the Zustand store.
// It should be called once when the application starts.
export const initializeAuthListener = () => {
  onAuthStateChanged(auth, async (user: User | null) => {
    const { setUser, fetchUserProfile, clearUser } = useUserStore.getState();
    if (user) {
      console.log("Firebase 인증 상태 변화: 사용자가 로그인되었습니다.", user.uid);
      setUser(user);
      // 로그인 시 프로필 정보 자동 로드
      await fetchUserProfile();
    } else {
      console.log("Firebase 인증 상태 변화: 사용자가 로그아웃되었습니다.");
      clearUser();
    }
  });
};

// Export logout function
export const logoutUser = async () => {
  try {
    console.log("로그아웃 요청...");
    await signOut(auth);
    console.log("Firebase 로그아웃 성공.");
    // Zustand 상태는 onAuthStateChanged 리스너에 의해 자동으로 초기화됩니다.
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error);
  }
};

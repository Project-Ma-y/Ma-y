import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';

// 확장된 사용자 정보 타입 정의
export interface UserProfile {
  uid: string | null;
  email: string | null;
  name?: string;
  phone?: string;
  gender?: string;
  address?: string;
  birthdate?: string;
  customerType?: string;
  // 등록된 가족 정보
  registeredFamily?: Array<{
    uid: string;
    name: string;
    relation: string;
    linkedAt: string;
  }>;
}

// 사용자 상태 타입 정의 (프로필 정보 포함)
export interface UserState {
  user: UserProfile;
  isLoading: boolean;
  isLoggedIn: boolean;
  setUser: (user: UserProfile) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

// Zustand 스토어 생성
export const useUserStore = create<UserState>((set) => ({
  user: {
    uid: null,
    email: null,
  },
  isLoading: true,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: !!user.uid }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: { uid: null, email: null }, isLoggedIn: false }),
}));

/**
 * Firebase 인증 상태 변경 리스너를 초기화하고 유저 스토어를 업데이트합니다.
 * 이 함수는 앱 시작 시 한 번만 호출되어야 합니다.
 * @param auth Firebase Auth 인스턴스
 */
export const initializeUser = (auth: Auth) => {
  useUserStore.getState().setLoading(true);

  const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      // 사용자가 로그인한 경우
      try {
        // Firebase 인증 토큰을 가져옵니다.
        const token = await user.getIdToken();
        // 토큰을 HTTP 헤더에 담아 사용자 프로필 API 호출
        const response = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const apiData = await response.json();

          // API 응답 데이터가 제공된 형식과 일치하는지 확인
          if (apiData && typeof apiData.id === 'string') {
            const userProfile: UserProfile = {
              uid: apiData.id,
              email: user.email, // Firebase 인증 정보에서 email 사용
              name: apiData.name,
              phone: apiData.phone,
              gender: apiData.gender,
              address: apiData.address,
              birthdate: apiData.birthdate,
              customerType: apiData.customerType,
              registeredFamily: apiData.registeredFamily,
            };
            useUserStore.getState().setUser(userProfile);
          } else {
            console.error("API response has an unexpected format.");
            // API 응답 형식이 예상과 다를 경우, 인증 정보만 저장
            useUserStore.getState().setUser({
              uid: user.uid,
              email: user.email,
            });
          }
        } else {
          // API 호출 실패 시, 인증 정보만 저장
          console.error(`Failed to fetch user profile from API. Status: ${response.status}`);
          useUserStore.getState().setUser({
            uid: user.uid,
            email: user.email,
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // 오류 발생 시, 인증 정보만 저장
        useUserStore.getState().setUser({
          uid: user.uid,
          email: user.email,
        });
      }
    } else {
      // 사용자가 로그아웃한 경우
      useUserStore.getState().setUser({
        uid: null,
        email: null,
      });
    }
    useUserStore.getState().setLoading(false);
  });

  // 이 리스너는 앱이 실행되는 동안 유지됩니다.
  return unsubscribe;
};

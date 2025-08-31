// src/store/userStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "firebase/auth";
import { api } from "@/lib/api";

interface UserState {
  user: User | null;
  profile: any | null;
  isLoggedIn: boolean;
  isUserLoading: boolean;
  isProfileLoading: boolean;
  error: string | null;

  setUser: (user: User) => void;
  setProfile: (profile: any) => void;
  clearUser: () => void;
  fetchUserProfile: () => Promise<void>;
}

console.log("API URL:", import.meta.env.VITE_API_URL);

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    user: null,
    profile: null,
    isLoggedIn: false,
    isUserLoading: true,
    isProfileLoading: false,
    error: null,

    setUser: (user) => {
      set({ user, isLoggedIn: !!user, isUserLoading: false });
    },

    setProfile: (profile) => {
      set({ profile, isProfileLoading: false });
    },

    clearUser: () => {
      set({
        user: null,
        profile: null,
        isLoggedIn: false,
        isUserLoading: false,
        isProfileLoading: false,
        error: null,
      });
    },

    fetchUserProfile: async () => {
      const { user, isProfileLoading } = get();
      const tokenFromLS = localStorage.getItem("token");

      // 유저도 없고 로컬 토큰도 없으면 스킵
      if (isProfileLoading || (!user && !tokenFromLS)) {
        console.log("프로필 로딩 중이거나 토큰/유저 없음. 스킵합니다.");
        return;
      }

      set({ isProfileLoading: true, error: null });

      try {
        // ✅ 우선순위: Firebase 현재 사용자 토큰 → 로컬스토리지 토큰
        let token = tokenFromLS || "";
        if (user?.getIdToken) {
          try {
            token = await user.getIdToken(false); // 필요 시 true로 강제 갱신
            localStorage.setItem("token", token);
          } catch {
            // Firebase 토큰 취득 실패 시 로컬 토큰으로 진행
          }
        }

        const res = await api.get("/users/me", {
          withCredentials: true, // 쿠키 항상 포함
          headers: token ? { Authorization: `Bearer ${token}` } : undefined, // 요청 시 토큰 동봉
        });

        set({ profile: res.data, isProfileLoading: false, error: null });
      } catch (err: any) {
        console.error("프로필 정보 가져오는 중 오류 발생:", err);
        const status = err?.response?.status;
        const msg =
          status === 401
            ? "로그인이 필요합니다."
            : err?.response?.data?.message ||
              err?.message ||
              "프로필 정보를 가져오는 중 오류 발생";

        // 401 시 프로필 초기화
        set({ isProfileLoading: false, error: msg, profile: null });
      }
    },
  }))
);

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
      if (isProfileLoading || !user) {
        console.log("프로필 데이터를 이미 불러오고 있거나, 유저가 존재하지 않습니다. 스킵합니다.");
        return;
      }

      set({ isProfileLoading: true, error: null });
      try {
        // ✅ 토큰은 인터셉터에서 자동 부착
        const response = await api.get("/users/me");
        set({ profile: response.data, isProfileLoading: false });
      } catch (err: any) {
        console.error("프로필 정보 가져오는 중 오류 발생:", err);
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "프로필 정보를 가져오는 중 오류 발생";
        set({ isProfileLoading: false, error: msg });
      }
    },
  }))
);

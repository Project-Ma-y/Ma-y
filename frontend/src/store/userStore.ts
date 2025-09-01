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

  /** ✅ 추가 */
  hasTriedProfile: boolean;     // 이미 한 번 시도했는지
  profileErrorCount: number;    // (선택) 실패 카운트

  setUser: (user: User) => void;
  setProfile: (profile: any) => void;
  clearUser: () => void;
  fetchUserProfile: () => Promise<void>;
  /** (선택) 재시도용 */
  resetProfileTry: () => void;
}

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    user: null,
    profile: null,
    isLoggedIn: false,
    isUserLoading: true,
    isProfileLoading: false,
    error: null,

    hasTriedProfile: false,
    profileErrorCount: 0,

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
        hasTriedProfile: false,
        profileErrorCount: 0,
      });
    },

    resetProfileTry: () => set({ hasTriedProfile: false, profileErrorCount: 0 }),

    fetchUserProfile: async () => {
      const { user, isProfileLoading, hasTriedProfile } = get();

      if (!user) {
        // 로그인 안 된 상태
        return;
      }
      if (isProfileLoading) {
        // 이미 로딩 중
        return;
      }
      if (hasTriedProfile) {
        // ✅ 이미 한 번 시도했으면 여기서 멈춤 (무한 루프 방지)
        return;
      }

      set({ isProfileLoading: true, error: null, hasTriedProfile: true });

      try {
        const res = await api.get("/users/me");
        set({ profile: res.data, isProfileLoading: false });
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "프로필 정보를 가져오는 중 오류 발생";
        set((s) => ({
          isProfileLoading: false,
          error: msg,
          profileErrorCount: s.profileErrorCount + 1,
        }));
        console.error("[userStore] 프로필 로드 실패:", err);
      }
    },
  }))
);

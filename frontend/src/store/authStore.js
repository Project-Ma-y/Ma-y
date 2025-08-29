// src/store/authStore.ts
import { create } from "zustand";
export const useAuthStore = create((set) => ({
    isLoggedIn: !!localStorage.getItem("idToken"),
    isAdmin: false, // 초기값은 false
    user: null,
    idToken: localStorage.getItem("idToken"),
    uid: localStorage.getItem("uid"),
    // ✅ setAuth 함수 구현: 기존 setLoginStatus의 로직을 그대로 사용
    setAuth: ({ isLoggedIn, isAdmin, user, idToken, uid }) => set({
        isLoggedIn,
        isAdmin: isAdmin ?? false, // isAdmin 값이 없으면 false로 설정
        user: user ?? null,
        idToken: idToken ?? null,
        uid: uid ?? null,
    }),
    // 기존 logout 함수 유지
    logout: () => {
        localStorage.removeItem("idToken");
        localStorage.removeItem("uid");
        set({ isLoggedIn: false, isAdmin: false, user: null, idToken: null, uid: null });
    },
}));

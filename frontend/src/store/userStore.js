import { create } from "zustand";
import { devtools } from "zustand/middleware";
const API_BASE_URL = "https://ma-y-5usy.onrender.com/api/users";
export const useUserStore = create()(devtools((set, get) => ({
    user: null,
    profile: null,
    isLoggedIn: false,
    isUserLoading: true, // Initially true, becomes false after the first auth check
    isProfileLoading: false, // Initial state should be false
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
        // 이미 프로필 로딩 중이거나 사용자가 없으면 호출을 스킵
        if (isProfileLoading || !user) {
            console.log("프로필 데이터를 이미 불러오고 있거나, 유저가 존재하지 않습니다. 스킵합니다.");
            return;
        }
        set({ isProfileLoading: true, error: null });
        const currentUser = user;
        try {
            const idToken = await currentUser.getIdToken();
            console.log("API 호출을 시작합니다. 사용자 토큰:", idToken ? "토큰 있음" : "토큰 없음");
            const response = await fetch(`${API_BASE_URL}/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
            });
            console.log("API 응답 상태:", response.status, response.statusText);
            if (response.ok) {
                const profileData = await response.json();
                console.log("프로필 데이터를 성공적으로 받았습니다:", profileData);
                set({ profile: profileData, isProfileLoading: false });
            }
            else {
                const errorData = await response.json();
                console.error(`API에서 프로필 가져오기 실패. 상태: ${response.status}`, errorData);
                set({ isProfileLoading: false, error: `프로필 가져오기 실패: ${errorData.message}` });
            }
        }
        catch (err) {
            console.error("프로필 정보 가져오는 중 오류 발생:", err);
            set({ isProfileLoading: false, error: "프로필 정보를 가져오는 중 오류 발생" });
        }
    },
})));

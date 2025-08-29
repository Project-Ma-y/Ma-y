import axios from "axios";
import { ENDPOINTS } from "@/lib/endpoints";
const BASE_URL = "https://ma-y-5usy.onrender.com";
// 회원가입 API 호출
export const register = async (payload) => {
    const url = `${BASE_URL}${ENDPOINTS.signupEmail}`;
    const response = await axios.post(url, payload);
    return response.data;
};
// 로그인 API 호출 (토큰 저장 로직 제거)
export const login = async (payload) => {
    const url = `${BASE_URL}${ENDPOINTS.login}`;
    const response = await axios.post(url, payload);
    return response.data; // 토큰을 반환
};
// 사용자 정보 API 호출
export const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No authentication token found.");
    }
    const url = `${BASE_URL}${ENDPOINTS.me}`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

import axios from "axios";
import { ENDPOINTS } from "@/lib/endpoints";

const BASE_URL = "https://api.mayservice.co.kr";

// 회원가입 요청 시 필요한 데이터 타입
export interface RegisterPayload {
  customerType: "family" | "senior";
  id: string;
  password: string;
  pwVerify: string;
  name: string;
  phone: string;
  gender: string;
  address: string;
  birthdate: string;
}

// 로그인 요청 시 필요한 데이터 타입
export interface LoginPayload {
  id: string;
  password: string;
}

// 사용자 프로필 데이터 타입
export interface UserProfile {
  name: string;
  customerType: "family" | "senior";
  phone: string;
  birthdate: string;
  address: string;
  id: string;
}

// 회원가입 API 호출
export const register = async (payload: RegisterPayload) => {
  const url = `${BASE_URL}${ENDPOINTS.signupEmail}`;
  const response = await axios.post(url, payload);
  return response.data;
};

// 로그인 API 호출 (토큰 저장 로직 제거)
export const login = async (payload: LoginPayload) => {
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
  const response = await axios.get<UserProfile>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

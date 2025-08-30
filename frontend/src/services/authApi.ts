// src/services/userApi.ts
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

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
  const { data } = await api.post(ENDPOINTS.signupEmail, payload);
  return data;
};

// 로그인 API 호출 (토큰은 Firebase SDK로 하거나, 서버 토큰 발급 시 그대로 반환)
export const login = async (payload: LoginPayload) => {
  const { data } = await api.post(ENDPOINTS.login, payload);
  return data;
};

// 사용자 정보 API 호출
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const { data } = await api.get<UserProfile>(ENDPOINTS.me);
  return data;
};

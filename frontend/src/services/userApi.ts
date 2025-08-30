// src/services/userApi.ts
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

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

export interface LoginPayload {
  id: string;
  password: string;
}

export interface UserProfile {
  name: string;
  customerType: "family" | "senior";
  phone: string;
  birthdate: string;
  address: string;
  id: string;
}

// 회원가입 (공개 엔드포인트)
export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post(ENDPOINTS.signupEmail, payload);
  return data;
};

/**
 * 로그인
 * - Firebase Web SDK를 쓰는 프로젝트면 이 함수는 쓰지 말고
 *   firebase/auth의 signInWithEmailAndPassword 사용.
 * - 백엔드 자체 토큰 방식일 때만 사용.
 */
export const login = async (payload: LoginPayload) => {
  const { data } = await api.post(ENDPOINTS.login, payload);
  return data;
};

// 내 프로필 (인증 필요) - 토큰은 api 인터셉터가 자동 부착
export const fetchUserProfile = async () => {
  const { data } = await api.get<UserProfile>(ENDPOINTS.me);
  return data;
};

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  birthdate?: string;
  gender?: string;
}

export const updateMyProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await api.put(ENDPOINTS.me, payload);
  return data;
};
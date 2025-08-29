// src/services/api.ts
import axios, { AxiosError } from "axios";
import { getAuth } from "firebase/auth";

// 프론트는 항상 같은 오리진('/api')로 호출 → 쿠키 자동 포함됨
export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// 매 요청에 Firebase 토큰을 Authorization에 실어줌
api.interceptors.request.use(async (config) => {
  const u = getAuth().currentUser;
  if (u) {
    const token = await u.getIdToken();
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  // withCredentials 강제 금지 (동일출처라 자동 쿠키 포함)
  (config as any).withCredentials = false;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original: any = err.config || {};
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const u = getAuth().currentUser;
      if (u) {
        await u.getIdToken(true); // 강제 갱신
        const fresh = await u.getIdToken();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${fresh}`;
        original.withCredentials = false;
        return api.request(original);
      }
    }
    return Promise.reject(err);
  }
);

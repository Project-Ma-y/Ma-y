// src/lib/api.ts
import axios, { AxiosError } from "axios";
import { getAuth } from "firebase/auth";

/**
 * baseURL 전략
 * - DEV: Vite devServer proxy로 '/api'
 * - PROD: VITE_API_URL(미지정 시 '/api'로 폴백)
 *
 *   Netlify 프록시를 쓰면 VITE_API_URL을 '/api'로 두고
 *   netlify.toml에서 백엔드로 라우팅하면 됨.
 */
const BASE_URL =
  import.meta.env.DEV ? "/api" : (import.meta.env.VITE_API_URL as string);

export const api = axios.create({
  baseURL: BASE_URL,   // ← 여기를 신뢰
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: false,
});

// Firebase ID 토큰 자동 부착
api.interceptors.request.use(async (config) => {
  const u = getAuth().currentUser;
  if (u) {
    const token = await u.getIdToken();
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  // 보수적으로 매 요청에 명시
  config.withCredentials = false;
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
        await u.getIdToken(true);
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

export default api;

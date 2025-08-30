// src/services/api.ts
import axios, { AxiosError } from "axios";
import { getAuth } from "firebase/auth";

/**
 * baseURL 전략
 * - DEV: Vite devServer proxy로 '/api'
 * - PROD: 반드시 VITE_API_URL로 절대 URL 제공 (예: https://your-backend.com/api)
 */
const BASE_URL =
  (import.meta.env.PROD
    ? import.meta.env.VITE_API_URL // 배포 환경: 절대 URL 필수
    : "/api") || "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: false,
});

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

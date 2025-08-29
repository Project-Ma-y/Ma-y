// src/services/api.ts
import axios, { AxiosError } from "axios";
import { getAuth } from "firebase/auth";

// Vite proxy로 동일 오리진('/api') 호출 → 쿠키 자동 포함
export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

api.interceptors.request.use(async (config) => {
  const u = getAuth().currentUser;
  if (u) {
    const token = await u.getIdToken();
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  (config as any).withCredentials = false; // 강제로 끔
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

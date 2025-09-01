// src/lib/api.ts
// ✅ axios 인스턴스: 쿠키 + Authorization Bearer 자동 부착(+리프레시 재시도)
//    normalizeEndpoint 도 여기서 export (Netlify 빌드 에러 방지)

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getIdTokenSafe } from "./token";

export const API_DEFAULT_BASE =
  (import.meta.env.VITE_API_BASE_URL as string) ?? "https://ma-y-5usy.onrender.com/api";

/** 엔드포인트 정규화: /api 중복 제거 + 선행 슬래시 부여 */
export function normalizeEndpoint(ep: string): string {
  let s = (ep ?? "").trim();
  if (!s) return "/";
  if (/^https?:\/\//i.test(s)) return s;
  s = s.replace(/^\/?api\/?/i, "");
  if (!s.startsWith("/")) s = `/${s}`;
  return s;
}

export function setApiBaseURL(nextBaseURL: string) {
  api.defaults.baseURL = nextBaseURL;
}

export function useFallbackBaseURL(): string {
  return API_DEFAULT_BASE;
}

export const api = axios.create({
  baseURL: useFallbackBaseURL(),
  withCredentials: false, // ✅ 서버 세션 병행 시 필요
  headers: { "Content-Type": "application/json" },
});

/** 요청 인터셉터: Firebase ID 토큰을 Authorization에 부착 */
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // 상대경로 보호
  if (config.url && !/^https?:\/\//i.test(config.url)) {
    config.url = normalizeEndpoint(config.url);
  }

  const token = await getIdTokenSafe(false);
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
    // ⚠️ 개발 디버깅용: 토큰 유무만 로깅 (값은 노출 금지)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[api] auth header attached");
    }
  } else {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[api] no firebase idToken; Authorization header not attached");
    }
  }
  return config;
});

/** 401 처리: 강제 토큰 리프레시 1회 후 재시도 */
let refreshing = false;
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const cfg = error.config as (AxiosError["config"] & { _retry?: boolean }) | undefined;
    const status = error.response?.status;

    if (status === 401 && cfg && !cfg._retry && !refreshing) {
      try {
        refreshing = true;
        const fresh = await getIdTokenSafe(true);
        refreshing = false;

        if (fresh) {
          cfg._retry = true;
          cfg.headers = { ...(cfg.headers ?? {}), Authorization: `Bearer ${fresh}` };
          if (cfg.url && !/^https?:\/\//i.test(cfg.url)) cfg.url = normalizeEndpoint(cfg.url);
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log("[api] retried with refreshed token");
          }
          return api.request(cfg);
        }
      } catch {
        refreshing = false;
      }
    }
    throw error;
  }
);

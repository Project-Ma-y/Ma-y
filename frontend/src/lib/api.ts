import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getIdTokenSafe } from "./token";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "https://api.mayservice.co.kr/api";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ✅ 쿠키도 계속 보냄 (서버에서 세션 병행 사용 시)
  headers: { "Content-Type": "application/json" },
});

/** 요청마다 Authorization: Bearer <idToken> 붙이기 */
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getIdTokenSafe(false);
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      // 필요 시 식별용 커스텀 헤더도 가능
      // "X-Auth-Provider": "firebase",
    };
  }
  return config;
});

/**
 * 401 응답 시 한 번만 강제 토큰 갱신해서 재시도
 * - 첫 시도: cached token (or 없음)
 * - 실패(401): forceRefresh=true 로 새 토큰 → Authorization 재설정 → 재요청
 */
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
          cfg.headers = {
            ...(cfg.headers ?? {}),
            Authorization: `Bearer ${fresh}`,
          };
          return api.request(cfg);
        }
      } catch {
        refreshing = false;
      }
    }

    throw error;
  }
);

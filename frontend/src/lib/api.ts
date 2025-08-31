// src/lib/api.ts
import axios from "axios";
import { getAuth } from "firebase/auth";
import { resolveAuthToken } from "@/services/token";

/**
 * Base URL 우선순위
 * 1) localStorage.API_BASE_URL (런타임 전환)
 * 2) VITE_API_URL (배포 환경변수, 예: https://api.mayservice.co.kr/api/)
 * 3) 기본값
 */
const ENV_BASE = (import.meta.env.VITE_API_URL as string) || "https://api.mayservice.co.kr/api/";

const normalizeBase = (u: string) => {
  let s = (u || "").trim();
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  if (!s.endsWith("/")) s += "/";
  return s;
};

const initialBase = localStorage.getItem("API_BASE_URL") || ENV_BASE;

export const api = axios.create({
  baseURL: normalizeBase(initialBase),
  withCredentials: true, // 쿠키 항상 포함
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


// ✅ 모든 요청에 로컬 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 로그인 시 저장된 토큰
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// 에러 가독성 + 401 1회 재시도
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err?.code === "ERR_NETWORK") {
      err.message = "네트워크 오류입니다. DNS 또는 서버 접속 문제일 수 있어요.";
    }

    const original: any = err.config || {};
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const u = getAuth().currentUser;
      if (u) {
        await u.getIdToken(true);
        const fresh = await u.getIdToken();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${fresh}`;
        original.withCredentials = true;
        return api.request(original);
      }
    }
    return Promise.reject(err);
  }
);

// ===== 런타임 전환 유틸 =====
export function getApiBaseURL() {
  return api.defaults.baseURL!;
}

export function setApiBaseURL(url: string) {
  const next = normalizeBase(url);
  api.defaults.baseURL = next;
  localStorage.setItem("API_BASE_URL", next);
}

export function useFallbackBaseURL(index = 0) {
  const fb = FALLBACKS[index];
  if (fb) setApiBaseURL(fb);
  return getApiBaseURL();
}

/** /api 중복 방지 + 선행 슬래시 보장 (필요한 곳에서 사용) */
export function normalizeEndpoint(ep: string) {
  let s = ep.trim();
  if (/^https?:\/\//i.test(s)) return s; // 풀 URL은 그대로
  s = s.replace(/^\/?api\/?/i, "");       // 앞 /api 제거
  if (!s.startsWith("/")) s = `/${s}`;
  return s;
}

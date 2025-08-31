import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAuth } from "firebase/auth"; // ✅ firebase 초기화는 services/firebase.ts에서
// import { auth } from "@/services/firebase"; // 이미 auth export가 있다면 이 라인으로 대체 가능

/** 기본 API BASE (env가 없으면 배포 도메인 사용) */
export const API_DEFAULT_BASE =
  (import.meta.env.VITE_API_BASE_URL as string) ?? "https://api.mayservice.co.kr/api";

/** 엔드포인트 문자열 정규화: 앞쪽 /api 중복 제거 + 선행 슬래시 보장 */
export function normalizeEndpoint(ep: string): string {
  let s = (ep ?? "").trim();
  if (!s) return "/";
  if (/^https?:\/\//i.test(s)) return s; // 풀 URL은 그대로
  s = s.replace(/^\/?api\/?/i, "");      // 앞쪽 /api 제거
  if (!s.startsWith("/")) s = `/${s}`;   // 선행 슬래시 보장
  return s;
}

/** 런타임에 baseURL 바꾸고 싶을 때 사용 */
export function setApiBaseURL(nextBaseURL: string) {
  api.defaults.baseURL = nextBaseURL;
}

/** 환경/호스트에 따라 fallback baseURL을 선택해서 반환 (필요 시 로직 확장) */
export function useFallbackBaseURL(): string {
  return API_DEFAULT_BASE;
}

/** 로그인되어 있으면 Firebase ID 토큰을 얻는다. 없으면 null */
async function getIdTokenSafe(forceRefresh = false): Promise<string | null> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    const t = await user.getIdToken(forceRefresh);
    return t ?? null;
  } catch {
    return null;
  }
}

export const api = axios.create({
  baseURL: useFallbackBaseURL(),
  withCredentials: true, // ✅ 서버 세션/쿠키 병행 시 필요
  headers: { "Content-Type": "application/json" },
});

/** 요청마다 Authorization: Bearer <idToken> 자동 부착 */
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getIdTokenSafe(false);
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      // "X-Auth-Provider": "firebase", // 필요 시 식별 헤더
    };
  }
  // 상대 경로인 경우 normalize
  if (config.url && !/^https?:\/\//i.test(config.url)) {
    config.url = normalizeEndpoint(config.url);
  }
  return config;
});

/** 401이면 토큰 강제 리프레시 1회 후 재시도 */
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
          // URL 재정규화(보호)
          if (cfg.url && !/^https?:\/\//i.test(cfg.url)) {
            cfg.url = normalizeEndpoint(cfg.url);
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

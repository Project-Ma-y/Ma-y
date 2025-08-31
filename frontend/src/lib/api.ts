// src/lib/api.ts
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

type Maybe<T> = T | null;

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.mayservice.co.kr/api";

/** -------------------------
 *  토큰 공급자 (백엔드 토큰 우선, 없으면 Firebase idToken)
 *  - 중복 동시 요청 시 1회만 발급 → 모두 대기(큐)
 *  - 필요 시 강제 갱신(forceRefresh)
 * ------------------------- */
let cachedBearer: Maybe<string> = null;
let inflight: Promise<Maybe<string>> | null = null;

async function fetchBearer(forceRefresh = false): Promise<Maybe<string>> {
  // 1) 로컬에 저장한 백엔드 토큰 우선
  const backend = localStorage.getItem("token");
  if (backend) return backend;

  // 2) Firebase idToken
  const auth = getAuth();
  const u = auth.currentUser;
  if (!u) return null;
  try {
    const idt = await u.getIdToken(forceRefresh);
    return idt;
  } catch {
    return null;
  }
}

async function getBearer(forceRefresh = false): Promise<Maybe<string>> {
  if (!forceRefresh && cachedBearer) return cachedBearer;
  if (!inflight) {
    inflight = (async () => {
      const t = await fetchBearer(forceRefresh);
      cachedBearer = t;
      return t;
    })().finally(() => (inflight = null));
  }
  return inflight;
}

/** Firebase 로그인/로그아웃에 맞춰 캐시 초기화 */
onAuthStateChanged(getAuth(), async (u) => {
  cachedBearer = null;
  if (u) {
    // 로그인 직후 한 번 미리 받아 캐싱
    try { cachedBearer = await u.getIdToken(false); } catch {}
  }
});

/** -------------------------
 *  Axios 인스턴스
 * ------------------------- */
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ 쿠키 항상 포함
  headers: { "Content-Type": "application/json" },
});

/** 요청 인터셉터: Authorization 자동 부착 */
api.interceptors.request.use(async (config) => {
  // 이미 명시되어 있으면 건너뜀
  const hasAuth =
    !!config.headers &&
    (("authorization" in config.headers) || ("Authorization" in config.headers as any));

  if (!hasAuth) {
    const bearer = await getBearer(false);
    if (bearer) {
      config.headers = { ...(config.headers ?? {}), Authorization: `Bearer ${bearer}` };
    }
  }

  // 디버깅(원할 때만)
  // console.debug("[REQ]", config.method, config.url, { hasAuth: !!bearer });

  return config;
});

/** 응답 인터셉터: 401이면 토큰 강제갱신 후 1회 재시도 */
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const cfg: any = err?.config ?? {};
    const status = err?.response?.status;

    if (status === 401 && !cfg._retry) {
      cfg._retry = true;
      // 강제 갱신 토큰으로 재시도
      const fresh = await getBearer(true);
      if (fresh) {
        cfg.headers = { ...(cfg.headers ?? {}), Authorization: `Bearer ${fresh}` };
        return api(cfg);
      }
    }
    return Promise.reject(err);
  }
);

/** 엔드포인트 경로 정규화(선택) */
export const normalizeEndpoint = (ep: string) => {
  let s = (ep || "").trim();
  if (/^https?:\/\//i.test(s)) return s;
  s = s.replace(/^\/?api\/?/i, "");
  if (!s.startsWith("/")) s = `/${s}`;
  return s.replace(/\/{2,}/g, "/");
};

/** 백엔드 토큰 저장 헬퍼(로그인 성공 시 호출) */
export function setBackendToken(token: string | null) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
  cachedBearer = token;
}

// src/lib/api.ts
import axios from "axios";
import { getAuth } from "firebase/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://api.mayservice.co.kr/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

async function obtainBearer(): Promise<string | null> {
  // 1) 백엔드 발급 토큰 우선
  const stored = localStorage.getItem("token");
  if (stored) return stored;

  // 2) Firebase idToken (로그인 직후에도 안전하게)
  const auth = getAuth();
  const u = auth.currentUser;
  if (!u) return null;
  try {
    return await u.getIdToken(false); // 필요시 true로 갱신
  } catch {
    return null;
  }
}

// 동시요청 중복 방지
let inFlight: Promise<string | null> | null = null;
async function getBearerOnce() {
  if (!inFlight) inFlight = obtainBearer().finally(() => (inFlight = null));
  return inFlight;
}

// ✅ 모든 요청에 Authorization 자동 부착
api.interceptors.request.use(async (cfg) => {
  // 이미 지정됐다면 건드리지 않음
  const hasAuth = cfg.headers && ("authorization" in (cfg.headers as any) || "Authorization" in (cfg.headers as any));
  if (!hasAuth) {
    const bearer = await getBearerOnce();
    if (bearer) {
      cfg.headers = { ...(cfg.headers ?? {}), Authorization: `Bearer ${bearer}` };
    }
  }
  return cfg;
});

// ✅ checkAdmin 401일 때 idToken 강제 갱신 후 1회 재시도
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const cfg: any = err?.config ?? {};
    if (!cfg || cfg._retry) return Promise.reject(err);

    const status = err?.response?.status;
    const isCheckAdmin = typeof cfg.url === "string" && cfg.url.includes("/auth/checkAdmin");

    if (status === 401 && isCheckAdmin) {
      cfg._retry = true;
      try {
        const auth = getAuth();
        if (auth.currentUser) {
          const fresh = await auth.currentUser.getIdToken(true);
          cfg.headers = { ...(cfg.headers ?? {}), Authorization: `Bearer ${fresh}` };
          return api(cfg);
        }
      } catch {
        /* ignore */
      }
    }
    return Promise.reject(err);
  }
);

// 유틸(선택)
export const normalizeEndpoint = (ep: string) => {
  let s = (ep || "").trim();
  if (/^https?:\/\//i.test(s)) return s;
  s = s.replace(/^\/?api\/?/i, "");
  if (!s.startsWith("/")) s = `/${s}`;
  return s.replace(/\/{2,}/g, "/");
};

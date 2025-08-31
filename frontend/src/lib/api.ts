// src/lib/api.ts
import axios from "axios";
import { getAuth } from "firebase/auth";

// ✅ 기본 설정: 쿠키 항상 포함 + Content-Type
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://api.mayservice.co.kr/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ✅ 요청 인터셉터: Firebase idToken/Bearer 자동 부착 (비동기 허용)
api.interceptors.request.use(async (config) => {
  // 로컬 토큰(백엔드 토큰) 우선
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = { ...(config.headers ?? {}), Authorization: `Bearer ${token}` };
    return config;
  }

  // 없으면 Firebase idToken 시도
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken(/* forceRefresh */ false);
      config.headers = { ...(config.headers ?? {}), Authorization: `Bearer ${idToken}` };
    }
  } catch {
    // 토큰 없음 → 그대로 진행 (백엔드에서 401을 줄 수 있음)
  }
  return config;
});

// ✅ 응답 인터셉터: /auth/checkAdmin 401 → 토큰 갱신 후 1회 재시도
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const cfg = err?.config ?? {};
    const isCheckAdmin = typeof cfg?.url === "string" && cfg.url.includes("/auth/checkAdmin");
    const status = err?.response?.status;

    // 이미 재시도한 요청은 _retry 플래그로 구분
    if (isCheckAdmin && status === 401 && !cfg._retry) {
      cfg._retry = true;
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const fresh = await user.getIdToken(true); // 강제 갱신
          cfg.headers = { ...(cfg.headers ?? {}), Authorization: `Bearer ${fresh}` };
          return api(cfg); // 1회 재시도
        }
      } catch {
        // 재시도 불가 → 그대로 실패
      }
    }
    return Promise.reject(err);
  }
);

export const normalizeEndpoint = (ep: string) => {
  let s = (ep || "").trim();
  if (/^https?:\/\//i.test(s)) return s;
  s = s.replace(/^\/?api\/?/i, "");
  if (!s.startsWith("/")) s = `/${s}`;
  return s.replace(/\/{2,}/g, "/");
};

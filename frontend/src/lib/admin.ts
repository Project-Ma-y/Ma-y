// src/lib/admin.ts
// ✅ /auth/checkAdmin 호출 래퍼 (쿠키 + 토큰 동시 전송)
import { api } from "./api";

export type CheckAdminResp = { ok: boolean; role?: string };

export async function checkAdmin() {
  // 서버 로그 식별 보조용 쿼리(선택)
  const { data } = await api.get<CheckAdminResp>("/auth/checkAdmin?_via=fe");
  return data;
}

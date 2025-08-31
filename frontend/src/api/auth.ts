// src/api/auth.ts
import { api } from "@/lib/api";

export type CheckAdminRes = { isAdmin: boolean };

// ✅ 서버는 uid를 내부 화이트리스트로 판별하므로 단순 GET 호출만 하면 됨
export async function checkAdmin(): Promise<CheckAdminRes> {
  const { data } = await api.get<CheckAdminRes>("/auth/checkAdmin");
  return data;
}

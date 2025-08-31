// src/api/auth.ts
import { api } from "@/lib/api";

export async function checkAdmin() {
  // ✅ 엔드포인트 정규화 생략 가능: api.baseURL 기준 상대 경로 사용
  const { data } = await api.get<{ isAdmin: boolean }>("/auth/checkAdmin");
  return data;
}

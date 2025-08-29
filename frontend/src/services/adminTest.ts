// src/services/adminTest.ts (선택: 서버 핑)
import { api } from "@/lib/axios";

export async function pingServer() {
  // 예: https://ma-y-5usy.onrender.com/api/auth/test (env로 빼도 됨)
  // const res = await api.get("/api/auth/test");
  return res.data;
}

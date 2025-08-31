// src/api/auth.ts
import { api } from "@/lib/api";

export type CheckAdminResp = { isAdmin: boolean; role?: string };

export async function checkAdmin(): Promise<CheckAdminResp> {
  const { data } = await api.get<CheckAdminResp>("/auth/checkAdmin");
  return data;
}

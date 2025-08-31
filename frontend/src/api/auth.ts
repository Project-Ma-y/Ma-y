// src/api/auth.ts
import { api } from "@/lib/api";

export async function checkAdmin() {
  const { data } = await api.get<{ isAdmin: boolean }>("/auth/checkAdmin");
  return data;
}

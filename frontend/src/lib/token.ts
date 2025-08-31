// src/lib/token.ts
// ✅ Firebase ID 토큰 안전 획득 유틸
import { auth } from "@/services/firebase";

export async function getIdTokenSafe(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    const t = await user.getIdToken(forceRefresh);
    return t ?? null;
  } catch {
    return null;
  }
}

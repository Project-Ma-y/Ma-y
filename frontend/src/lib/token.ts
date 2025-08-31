import { auth } from "@/services/firebase";

/** 로그인 되어 있으면 Firebase ID 토큰을 가져온다. 없으면 null */
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

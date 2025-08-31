// src/services/token.ts
// ✅ 로컬스토리지/세션스토리지/Firebase 순으로 토큰 조회
export async function resolveAuthToken(): Promise<string | null> {
  const ls = localStorage.getItem("token");
  if (ls) return ls;

  const ss = sessionStorage.getItem("token");
  if (ss) return ss;

  // 선택적 Firebase 연동 (존재하지 않으면 조용히 무시)
  try {
    const mod = await import("@/services/firebase");
    const auth = (mod as any)?.auth || (mod as any)?.default || null;
    const user = auth?.currentUser;
    if (user?.getIdToken) {
      return await user.getIdToken(/* forceRefresh */ false);
    }
  } catch {
    // firebase 미사용 프로젝트도 통과
  }
  return null;
}

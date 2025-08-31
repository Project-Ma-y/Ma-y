// src/components/auth/AdminRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdmin } from "@/api/auth";
import { waitForAuthInit } from "@/lib/firebase";

type Props = { children: React.ReactNode };

export default function AdminRoute({ children }: Props) {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // 1) Firebase가 현재 사용자 로딩을 끝낼 때까지 대기
      const user = await waitForAuthInit();

      // 2) 미로그인 → 로그인 페이지로
      if (!user) {
        nav(`/login?next=${encodeURIComponent("/admin")}`, { replace: true });
        if (mounted) setReady(true);
        return;
      }

      // 3) 로그인됨 → 이제 토큰이 인터셉터로 자동 부착된 상태에서 관리자 확인
      try {
        const res = await checkAdmin();
        if (!res?.isAdmin) {
          nav("/", { replace: true });
          return;
        }
      } catch (e: any) {
        // 401은 토큰 갱신 재시도 후에도 실패한 케이스
        if (e?.response?.status === 401) {
          nav(`/login?next=${encodeURIComponent("/admin")}`, { replace: true });
          return;
        }
        nav("/", { replace: true });
        return;
      } finally {
        if (mounted) setReady(true);
      }
    })();

    return () => { mounted = false; };
  }, [nav]);

  if (!ready) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <div className="animate-pulse text-gray-500">관리자 확인 중…</div>
      </div>
    );
  }
  return <>{children}</>;
}

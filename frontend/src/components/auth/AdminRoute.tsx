// src/components/auth/AdminRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdmin } from "@/api/auth";

type Props = { children: React.ReactNode };

export default function AdminRoute({ children }: Props) {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await checkAdmin();          // 쿠키 + Bearer 자동 전송
        if (!res?.isAdmin) {
          nav("/", { replace: true });
          return;
        }
      } catch (e: any) {
        // 401은 api 인터셉터가 토큰 재시도 후에도 실패 케이스
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

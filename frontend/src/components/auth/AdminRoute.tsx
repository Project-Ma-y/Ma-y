// src/router/AdminRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdmin } from "@/api/auth";

type Props = { children: React.ReactNode };

/**
 * ✅ Admin 라우트 가드
 * - 첫 진입 시 /auth/checkAdmin 호출
 * - 401이면 로그인 플로우(예: /login?next=/admin)로 보냄
 * - isAdmin=false면 메인으로 이동
 * - 토큰 도착 타이밍 문제를 인터셉터 재시도로 흡수
 */
export default function AdminRoute({ children }: Props) {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await checkAdmin(); // 인터셉터가 토큰/재시도 처리
        if (!res?.isAdmin) {
          nav("/", { replace: true });
          return;
        }
      } catch (e: any) {
        const status = e?.response?.status;
        // 401 → 로그인 페이지로
        if (status === 401) {
          const next = encodeURIComponent("/admin");
          nav(`/login?next=${next}`, { replace: true });
          return;
        }
        // 기타 오류 → 메인
        nav("/", { replace: true });
        return;
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
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

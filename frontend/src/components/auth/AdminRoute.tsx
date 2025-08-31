// src/components/auth/AdminRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdmin } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { AdminPage } from "@/router";

export function AdminRoute() {
  const nav = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await checkAdmin(); // ✅ 토큰은 인터셉터가 알아서 붙임
        if (res.isAdmin) {
          setAuth({ isLoggedIn: true, isAdmin: true });
          setIsAdmin(true);
        } else {
          setError("관리자 권한이 없습니다.");
          nav("/");
        }
      } catch (e: any) {
        if (e?.response?.status === 401) {
          setError("로그인이 필요합니다.");
          nav("/login");
        } else {
          setError("서버 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [setAuth, nav]);

  if (loading) return <div>관리자 인증 중...</div>;
  if (isAdmin) return <AdminPage />;
  return <div>{error}</div>;
}

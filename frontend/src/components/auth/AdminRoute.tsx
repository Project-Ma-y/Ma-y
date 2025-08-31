// src/components/auth/AdminRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminPage } from "@/router";
import { api } from "@/lib/api"; // ✅ axios 인스턴스
import { useAuthStore } from "@/store/authStore";

export function AdminRoute() {
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ 로그인 후 저장해둔 토큰
        if (!token) {
          setError("로그인이 필요합니다.");
          nav("/login");
          return;
        }

        const res = await api.get("/auth/checkAdmin", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // ✅ 쿠키 항상 포함
        });

        if (res.data?.isAdmin) {
          setAuth({ isLoggedIn: true, isAdmin: true });
          setIsAdmin(true);
        } else {
          setError("관리자 권한이 없습니다.");
          nav("/");
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("인증되지 않은 사용자입니다.");
          nav("/login");
        } else {
          setError("서버 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [nav, setAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-gray-500">관리자 인증 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return isAdmin ? <AdminPage /> : null;
}

// src/components/auth/AdminRoute.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { AdminPage } from "@/router";

type Phase = "loading" | "ok" | "denied" | "error";

export function AdminRoute() {
  const nav = useNavigate();
  const { setAuth } = useAuthStore();
  const [phase, setPhase] = useState<Phase>("loading");
  const [msg, setMsg] = useState("");

  const run = useCallback(async () => {
    setPhase("loading");
    setMsg("");
    const token = localStorage.getItem("token");
    if (!token) {
      setPhase("denied");
      setMsg("로그인이 필요합니다.");
      return;
    }
    try {
      const res = await api.get("/auth/checkAdmin");
      const ok = !!res.data?.isAdmin;
      if (ok) {
        setAuth({ isLoggedIn: true, isAdmin: true });
        setPhase("ok");
      } else {
        setPhase("denied");
        setMsg("관리자 권한이 없습니다.");
      }
    } catch (e: any) {
      const code = e?.response?.status;
      if (code === 401) {
        setPhase("denied");
        setMsg("인증되지 않은 사용자입니다.");
      } else {
        setPhase("error");
        setMsg(
          e?.response?.data?.message ??
            "서버에 문제가 발생했습니다. 나중에 다시 시도해주세요."
        );
      }
    }
  }, [setAuth]);

  useEffect(() => {
    run();
  }, [run]);

  if (phase === "loading") {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-gray-500">관리자 인증 중…</div>
      </div>
    );
  }

  if (phase === "ok") {
    return <AdminPage />;
  }

  if (phase === "denied") {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
          <div className="text-red-600 font-semibold">{msg}</div>
          <div className="mt-4 flex gap-2">
            <button
              className="flex-1 rounded-xl border px-4 py-2"
              onClick={() => nav("/login")}
            >
              로그인
            </button>
            <button
              className="flex-1 rounded-xl bg-gray-900 text-white px-4 py-2"
              onClick={() => nav("/")}
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <div className="text-red-600 font-semibold">{msg}</div>
        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-xl border px-4 py-2" onClick={run}>
            다시 시도
          </button>
          <button
            className="flex-1 rounded-xl bg-gray-900 text-white px-4 py-2"
            onClick={() => nav("/")}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}

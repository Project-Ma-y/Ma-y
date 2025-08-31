// src/components/auth/AdminRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdmin } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { AdminPage } from "@/router";

type Phase = "loading" | "ok" | "denied" | "error";

export function AdminRoute() {
  const nav = useNavigate();
  const { setAuth } = useAuthStore();
  const [phase, setPhase] = useState<Phase>("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      setPhase("loading");
      setMsg("");
      try {
        const res = await checkAdmin(); // ✅ 토큰/쿠키는 인터셉터가 처리
        if (res.isAdmin) {
          setAuth({ isLoggedIn: true, isAdmin: true });
          setPhase("ok");
        } else {
          setPhase("denied");
          setMsg("관리자 권한이 없습니다.");
        }
      } catch (e: any) {
        const s = e?.response?.status;
        if (s === 401) {
          setPhase("denied");
          setMsg("로그인이 필요합니다."); // ← 여기가 뜨던 지점
        } else {
          setPhase("error");
          setMsg(
            e?.response?.data?.message ??
              "서버에 문제가 발생했습니다. 나중에 다시 시도해주세요."
          );
        }
      }
    })();
  }, [setAuth]);

  if (phase === "loading") {
    return (
      <div className="min-h-dvh grid place-items-center">
        <p className="text-gray-500">관리자 인증 중…</p>
      </div>
    );
  }

  if (phase === "ok") return <AdminPage />;

  // ❗ 접근 거부/오류 화면에서도 이동 버튼 제공
  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <p className={phase === "error" ? "text-red-600" : "text-gray-800"}>
          {msg}
        </p>
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

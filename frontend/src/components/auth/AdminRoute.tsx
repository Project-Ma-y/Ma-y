// src/components/auth/AdminRoute.tsx
import { useEffect, useState } from "react";
import { AdminPage } from "@/router";
import { useAuthStore } from "@/store/authStore";

const ADMIN_PASS = "mayAdmin123";
const SESSION_KEY = "admin_gate_ok"; // 세션 유지용

export function AdminRoute() {
  const { setAuth } = useAuthStore();
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ok = sessionStorage.getItem(SESSION_KEY) === "1";
    if (ok) {
      setUnlocked(true);
      setAuth({ isLoggedIn: true, isAdmin: true });
    }
  }, [setAuth]);

  const submit = () => {
    if (password === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuth({ isLoggedIn: true, isAdmin: true }); // 로컬 상태만 갱신
      setUnlocked(true);
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  if (unlocked) {
    return <AdminPage />;
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-bold text-gray-900">Admin Page</h1>
        <p className="mt-1 text-sm text-gray-500">
          관리자 비밀번호를 입력하세요.
        </p>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            autoFocus
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="••••••••••"
            className="w-full rounded-xl border px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={submit}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition"
          >
            로그인
          </button>
          <button
            onClick={() => {
              setPassword("");
              setError(null);
            }}
            className="rounded-xl border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            초기화
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          * 브라우저 세션 동안만 유지됩니다.
        </div>
      </div>
    </div>
  );
}

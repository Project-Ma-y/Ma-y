// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Input from "@/components/Input";
import Button from "@/components/button/Button";
import { loginWithFirebase } from "@/services/firebaseAuth";
import { useAuthStore } from "@/store/authStore";
import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth as firebaseAuth } from "@/services/firebase";

export default function Login() {
  const nav = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverResp, setServerResp] = useState("");

  // ✅ 로그인 성공 시 /home 으로 이동
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setAuth(user); // Zustand에 사용자 상태 저장
        nav("/home");  // 홈으로 이동
      }
    });

    return () => unsubscribe();
  }, [nav, setAuth]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");
    setServerResp("");
    setLoading(true);

    try {
      let finalEmail = email.trim();
      if (!finalEmail.includes("@")) {
        finalEmail += "@may.com";
      }
      await loginWithFirebase(finalEmail, password);
    } catch (e: any) {
      setErr(e.message);
      console.error("로그인 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout headerProps={{ showHeader: false, showBack: true }} showNav={false}>
      <div className="flex flex-col items-center mb-6">
        <img src="/assets/logo/logo.png" className="w-15" alt="" />
        <h1 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">Ma:y</h1>
        <p className="mt-1 text-sm text-gray-500">Make it easy</p>
      </div>
      <form onSubmit={submit} className="mx-auto w-full max-w-sm space-y-4">
        <Input
          label="아이디"
          placeholder="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helpText="영문, 숫자 포함 8~12자"
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helpText="영문 대소문자, 숫자, 특수기호 포함 8~14자"
        />
        {err && <div className="text-sm text-red-500">{err}</div>}
        <Button
          type="default"
          buttonName={loading ? "로그인 중..." : "로그인"}
          className="w-full"
          disabled={loading}
        />
        <div className="text-center text-sm text-gray-500">
          계정이 없나요?{" "}
          <Link to="/signup" className="text-[var(--color-primary)]">
            회원가입
          </Link>
        </div>
        {serverResp && (
          <pre className="mt-3 max-h-60 overflow-auto rounded-xl bg-gray-50 p-3 text-xs">
            {serverResp}
          </pre>
        )}
      </form>
    </MainLayout>
  );
}

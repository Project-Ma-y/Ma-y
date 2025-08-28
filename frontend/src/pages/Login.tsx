// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Input from "@/components/Input";
import Button from "@/components/button/Button";
import { loginWithFirebase } from "@/services/firebaseAuth";
import { useAuthStore } from "@/store/authStore";
import { pingServer } from "@/services/adminTest";
import React from 'react';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          setAuth({ uid: user.uid, idToken });
          // pingServer 함수는 토큰을 헤더에 담아 호출해야 합니다.
          // 현재 코드에서는 pingServer 함수가 토큰을 어떻게 사용하는지 알 수 없으므로,
          // 만약 pingServer가 토큰을 필요로 한다면 해당 함수를 수정해야 합니다.
          const data = await pingServer();
          setServerResp(JSON.stringify(data, null, 2));
        } catch (e) {
          setServerResp(`서버 호출 실패: ${e?.response?.data?.message ?? e?.message}`);
        }
        nav("/home");
      }
    });

    return () => unsubscribe();
  }, [setAuth, nav]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");
    setServerResp("");
    setLoading(true);

    try {
      // 이메일 유효성 검사 (간단한 형태)
      let finalEmail = email.trim();
      // 이메일 주소에 "@" 기호가 포함되어 있지 않으면 "@may.com"을 추가
      if (!finalEmail.includes('@')) {
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
    <MainLayout
      headerProps={{ showHeader: false, showBack: true }}
      showNav={false}
    >
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
          계정이 없나요? <Link to="/signup" className="text-[var(--color-primary)]">회원가입</Link>
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

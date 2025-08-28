// src/pages/AuthLanding.tsx
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/button/Button";
import { useNavigate } from "react-router-dom";

export default function AuthLanding() {
  const nav = useNavigate();
  return (
    <MainLayout 
      // ✅ headerProps, showNav를 false로 설정하여 헤더와 내비게이션 숨김
      headerProps={{ showHeader: false }} 
      showNav={false}
      contentBg="bg-white"
    >
      <div className="flex flex-col items-center justify-between h-full">
        <div className="flex flex-col items-center mt-8">
          <div className="text-[44px] font-extrabold leading-none text-[var(--color-primary)]">Ma:y</div>
          <div className="mt-1 text-[10px] tracking-wide text-[var(--color-primary)]">Make it easy</div>
          {/* ✅ 부제목과 버튼 간격 조정을 위해 mt-12로 수정 */}
          <div className="mt-12 text-[15px] font-extrabold text-black">시니어 생활 통합 솔루션</div>
        </div>
        {/* ✅ 버튼의 상단 마진을 추가하여 간격 조정 */}
        <div className="w-full space-y-3 pb-12 mt-10">
          <Button type="primary" buttonName="회원가입" className="w-full h-14 rounded-2xl text-lg" onClick={() => nav("/signup")} />
          <Button type="secondary" buttonName="로그인" className="w-full h-14 rounded-2xl text-lg" onClick={() => nav("/login")} />
        </div>
      </div>
    </MainLayout>
  );
}

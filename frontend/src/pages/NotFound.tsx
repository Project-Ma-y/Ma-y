// src/pages/NotFound.tsx
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/button/Button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const nav = useNavigate();
  return (
    <MainLayout headerProps={{ title: "페이지 없음", showBack: true }}>
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <div className="text-xl font-extrabold">404 Not Found</div>
        <div className="text-sm text-gray-500">요청하신 페이지를 찾을 수 없습니다.</div>
        <Button type="primary" buttonName="홈으로" onClick={() => nav("/")} />
      </div>
    </MainLayout>
  );
}

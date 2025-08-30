// src/pages/Home.tsx
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/button/Button";
import Card from "@/components/Card";
import { useNavigate } from "react-router-dom";
import may1Url from "/assets/img/may_1.png";
import may2Url from "/assets/img/may_2.png"; // ✅ 추가
import proLabelUrl from "/assets/img/pro_label.png";

export default function Home() {
  const nav = useNavigate();

  // 🔸 홈 추천 영역에서 사용할 하드코딩 매니저 정보 (프로필 페이지와 일치)
  const managers = [
    {
      id: "1",
      name: "이선희 동행매니저",
      location: "서울 동대문구 장안동",
      isPro: true,
      avatarSrc: "/assets/img/profile_1.png",
    },
    {
      id: "2",
      name: "박정숙 동행매니저",
      location: "서울 성북구 안암동",
      isPro: true,
      avatarSrc: "/assets/img/profile_2.png",
    },
  ];

  // ✅ 자동 슬라이드 상태/로직
  const banners = [may1Url, may2Url];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    // 사전 로드(부드러운 전환)
    banners.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const id = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % banners.length);
    }, 3500); // 3.5초마다 다음 슬라이드
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout headerProps={{ type: "default" }}>
      {/* Hero 자동 슬라이드 */}
      <div className="overflow-hidden rounded-2xl h-[270px]">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {banners.map((src, i) => (
            <div key={i} className="w-full shrink-0 h-full bg-gray-200 relative">
              <img src={src} alt={`메이 배너 ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* 동행 예약하기 카드 */}
      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-primary)]/15">
            <svg
              className="h-4 w-4 text-[var(--color-primary)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 2a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-1V3a1 1 0 1 0-2 0v1H8V3a1 1 0 0 0-1-1Zm13 7H4v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9Z" />
            </svg>
          </span>
          <div className="flex-1">
            <div className="text-lg font-extrabold">동행 예약하기</div>
            <div className="mt-1 text-sm text-gray-500">꼭 필요한 정보들만 입력하세요!</div>
          </div>
        </div>
        <Button
          type="primary"
          className="h-12 w-full rounded-2xl text-lg"
          buttonName="예약하기"
          onClick={() => nav("/reservation")}
        />
      </Card>

      {/* 🔸 동행매니저 추천 */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-gray-700">동행매니저 추천</div>

        {managers.map((m) => (
          <ManagerListItem
            key={m.id}
            name={m.name}
            sub={m.location}
            avatarSrc={m.avatarSrc}
            isPro={m.isPro}
            onClick={() => nav(`/profile/${m.id}`)}
          />
        ))}
      </div>
    </MainLayout>
  );
}

function ManagerListItem({
  name,
  sub,
  avatarSrc,
  isPro,
  onClick,
}: {
  name: string;
  sub: string;
  avatarSrc?: string;
  isPro?: boolean;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left" aria-label={`${name} 프로필로 이동`}>
      <Card className="flex items-center justify-between p-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* 아바타 */}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt={`${name} 프로필`} className="h-full w-full object-cover" />
            ) : (
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
              </svg>
            )}
          </span>

          {/* 텍스트 */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-bold">{name}</span>
              {isPro && (
                <img
                  src={proLabelUrl}
                  alt="Pro 인증"
                  className="h-4 w-auto object-contain translate-y-[1px]"
                />
              )}
            </div>
            <div className="truncate text-xs text-gray-500">{sub}</div>
          </div>
        </div>

        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Card>
    </button>
  );
}

function TabIcon({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={[
          "flex h-10 w-10 items-center justify-center rounded-2xl border",
          active
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
            : "border-gray-200 text-gray-400",
        ].join(" ")}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3l9 8h-3v9H6v-9H3l9-8Z" />
        </svg>
      </div>
      <div
        className={[
          "text-[11px]",
          active ? "text-[var(--color-primary)] font-semibold" : "text-gray-400",
        ].join(" ")}
      >
        {label}
      </div>
    </div>
  );
}

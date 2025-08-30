// src/pages/Home.tsx
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/button/Button";
import Card from "@/components/Card";
import { useNavigate } from "react-router-dom";
import may1Url from "/assets/img/may_1.png";
import may2Url from "/assets/img/may_2.png";
import proLabelUrl from "/assets/img/pro_label.png";

export default function Home() {
  const nav = useNavigate();

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

  const banners = [may1Url, may2Url];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    banners.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    const id = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % banners.length);
    }, 3500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout headerProps={{ type: "default" }}>
      {/* ✅ 고정 비율 배너 (16:9). 필요하면 '21 / 9' 또는 '4 / 3' 등으로 변경 */}
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "16 / 9" }}
      >
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {banners.map((src, i) => (
            <div key={i} className="w-full h-full shrink-0 bg-gray-200">
              <img
                src={src}
                alt={`메이 배너 ${i + 1}`}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 동행 예약하기 카드 */}
      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-primary)]/15">
            <svg className="h-4 w-4 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
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

      {/* 동행매니저 추천 */}
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
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt={`${name} 프로필`} className="h-full w-full object-cover" />
            ) : (
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
              </svg>
            )}
          </span>
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

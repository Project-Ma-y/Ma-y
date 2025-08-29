// src/pages/Home.tsx
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/button/Button";
import Card from "@/components/Card";
import { useNavigate } from "react-router-dom";
import may1Url from "/assets/img/may_1.png";

export default function Home() {
  const nav = useNavigate();

  return (
    <MainLayout
      headerProps={{
        type:"default",
       
      }}
    >
      {/* Hero 이미지 자리 (사각 박스) */}
      <div className="overflow-hidden rounded-2xl">
        <div className="relative h-full bg-gray-200">
          {/* 사진 대신 플레이스홀더 텍스트 */}
          
            <img src={may1Url} alt="may" />
          

          
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
            <div className="mt-1 text-sm text-gray-500">
              꼭 필요한 정보들만 입력하세요!
            </div>
          </div>
        </div>
        <Button
          type="primary"
          className="h-12 w-full rounded-2xl text-lg"
          buttonName="예약하기"
          onClick={() => nav("/reservation")}
        />
      </Card>

      {/* 추천 동행인 */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-gray-700">동행인 추천</div>

        <CompanionListItem
          name="김콩쥐 동행인"
          sub="정보, 한줄소개 또는 전화번호"
          onClick={() => nav("/profile/1")}
        />
        <CompanionListItem
          name="김팥쥐 동행인"
          sub="정보, 한줄소개 또는 전화번호"
          onClick={() => nav("/profile/2")}
        />
      </div>
    </MainLayout>
  );
}

function CompanionListItem({
  name,
  sub,
  onClick,
}: {
  name: string;
  sub: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left"
      aria-label={`${name} 프로필로 이동`}
    >
      <Card className="flex items-center justify-between p-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200">
            <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
            </svg>
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="truncate text-sm font-bold">{name}</span>
              <svg className="h-3.5 w-3.5 text-[#2F6BFF]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2l2.39 1.2 2.67-.36 1.46 2.3 2.48 1.1-.5 2.64.5 2.64-2.48 1.1-1.46 2.3-2.67-.36L10 18l-2.39-1.2-2.67.36-1.46-2.3L1 13.56l.5-2.64L1 8.28l2.48-1.1 1.46-2.3 2.67.36L10 2zm-1 11l5-5-1.41-1.41L9 9.17 7.41 7.59 6 9l3 4z" />
              </svg>
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
        {/* 간단 아이콘 */}
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
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

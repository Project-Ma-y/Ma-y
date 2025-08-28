// src/pages/CompanionInfoPage.tsx
import React from "react";
import Card from "@/components/Card";

const STEPS = ["신청완료", "예약확인", "동행인 출발", "동행 중"];
const ACTIVE_INDEX = 3; // 0~3

export default function CompanionInfoPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-3 text-xl font-extrabold">동행 정보</h1>

      <Card className="p-0 shadow-md">
        {/* 상단 지도 */}
        <div className="rounded-3xl border border-gray-200 bg-gray-100 p-3">
          <div className="relative h-48 w-full rounded-2xl bg-gray-200">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[17px] text-gray-400">
              Map
            </span>
          </div>

          {/* 진행 바 */}
          <div className="mt-3">
            <div className="h-1.5 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[var(--color-primary)]"
                style={{ width: `${((ACTIVE_INDEX + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            <div className="mt-2 grid grid-cols-4">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`text-center text-[12px] ${
                    i === ACTIVE_INDEX ? "font-semibold text-black" : "text-gray-400"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
            <div className="mt-1 text-right text-[12px] text-[var(--color-primary)] underline">
              실시간 위치보기
            </div>
          </div>
        </div>

        {/* 정보 블록 */}
        <div className="mt-3 divide-y">
          <InfoRow label="동행 목적지(?)" value="서울 아산병원" boldRight />
          <InfoRow label="출발지" value="자택(서울 강남구 00000)" boldRight />
          <InfoRow label="동행 시간" value="오후 2:00 ~ 오후 4:00" boldRight />

          {/* 동행인 */}
          <div className="px-4 py-3">
            <div className="mb-2 text-[13px] font-semibold text-gray-800">동행인</div>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[15px] font-bold">
                    성이름 <span className="font-medium text-gray-600">동행인</span>
                    <svg className="h-3.5 w-3.5 text-[#2F6BFF]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2l2.39 1.2 2.67-.36 1.46 2.3 2.48 1.1-.5 2.64.5 2.64-2.48 1.1-1.46 2.3-2.67-.36L10 18l-2.39-1.2-2.67.36-1.46-2.3L1 13.56l.5-2.64L1 8.28l2.48-1.1 1.46-2.3 2.67.36L10 2zm-1 11l5-5-1.41-1.41L9 9.17 7.41 7.59 6 9l3 4z" />
                    </svg>
                  </div>
                  <div className="truncate text-[12px] text-gray-400">정보, 한줄소개 또는 전화번호</div>
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
            </button>
          </div>

          {/* 결제 금액 */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[13px] font-semibold text-gray-800">결제 금액</span>
            <span className="text-[20px] font-extrabold">14,000 원</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({
  label,
  value,
  boldRight = false,
}: {
  label: string;
  value: string;
  boldRight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] text-gray-600">{label}</span>
      <span className={`text-[16px] ${boldRight ? "font-extrabold text-black" : "text-gray-800"}`}>
        {value}
      </span>
    </div>
  );
}

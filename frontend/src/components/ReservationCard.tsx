// src/components/reservation/ReservationCard.tsx
import React from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { api } from "@/lib/api"; // ✅ axios 인스턴스

type Status = "reserved" | "ongoing" | "finished";

type ReservationCardProps = {
  id: string;
  status: Status;
  dateText: string;
  title: string;
  companionText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const statusLabel: Record<Status, { text: string; className: string }> = {
  reserved: { text: "예약완료", className: "text-[#2F6BFF]" },
  ongoing: { text: "동행중", className: "text-[var(--color-primary)]" },
  finished: { text: "동행완료", className: "text-[#16A34A]" },
};

export default function ReservationCard({
  id,
  status,
  dateText,
  title,
  companionText = "ㅇㅇㅇ 동행인",
  onConfirm,
  onCancel,
}: ReservationCardProps) {
  const s = statusLabel[status];
  const isReserved = status === "reserved";

  const handleBookingLog = async () => {
    try {
      await api.get("/sessions/booking"); // ✅ 예약하기 버튼 누른 순간 로깅
    } catch (err) {
      console.error("예약하기 통계 로깅 실패:", err);
    }
  };

  return (
    <Link to={`/reservation/${id}`}>
      <Card className="relative space-y-4">
        {/* 우측 화살표 */}
        <svg
          className="absolute right-4 top-4 h-6 w-6 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>

        {/* 상단 라벨 + 날짜 */}
        <div className="flex items-center gap-3 pr-8">
          <span className={clsx("text-lg font-extrabold", s.className)}>
            {s.text}
          </span>
          <span className="text-lg text-gray-400">{dateText}</span>
        </div>

        {/* 타이틀 */}
        <h3 className="text-2xl font-extrabold text-black">{title}</h3>

        {/* 동행인 줄 */}
        <div className="flex items-center gap-2 text-gray-600">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200">
            <svg
              className="h-4 w-4 text-gray-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
            </svg>
          </span>
          <span className="text-base">{companionText}</span>
        </div>

        {/* 하단 버튼 */}
        {isReserved ? (
          <div className="mt-2 grid grid-cols-2 gap-5">
            <Button
              type="primary"
              buttonName="예약확인"
              onClick={async (e) => {
                e.preventDefault();
                await handleBookingLog(); // ✅ 예약 확인 누른 순간 로깅
                if (onConfirm) onConfirm();
              }}
              className="h-16 w-full rounded-3xl text-2xl"
            />
            <Button
              type="secondary"
              buttonName="예약취소"
              onClick={(e) => {
                e.preventDefault();
                if (onCancel) onCancel();
              }}
              className="h-16 w-full rounded-3xl text-2xl"
            />
          </div>
        ) : (
          <div className="mt-2">
            <Button
              type="close"
              buttonName="예약 취소하기"
              onClick={(e) => {
                e.preventDefault();
                if (onCancel) onCancel();
              }}
              className="h-16 w-full rounded-3xl text-2xl"
            />
          </div>
        )}
      </Card>
    </Link>
  );
}

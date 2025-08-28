// src/pages/ReservationDetail.tsx
import React from "react";
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import clsx from "clsx";
import { Link } from "react-router-dom";

// 간단한 구분선 컴포넌트
const Divider = () => <div className="h-0.5 bg-gray-100"></div>;

export default function ReservationDetail() {
  // 모의 데이터
  const reservationDetails = {
    status: "ongoing", // 'reserved' | 'ongoing' | 'finished' | 'canceled'
    destination: "서울 아산병원",
    departure: "자택(서울 강남구 00000)",
    time: "오후 2:00 ~ 오후 4:00",
    companion: {
      name: "성 이름",
      details: "정보, 한줄소개 또는 전화번호",
    },
    paymentAmount: "14,000",
  };

  const statusMap = {
    reserved: "예약확인",
    ongoing: "동행 중",
    finished: "동행 완료",
    canceled: "예약 취소",
  };

  return (
    <MainLayout
      headerProps={{
        title: "예약 내역 - 선택 시",
        showBack: true,
      }}
      showNav={true}
    >
      <div className="flex flex-col space-y-4">
        {/* 상단 탭 (진행 상태 표시) */}
        <div className="flex w-full justify-between overflow-hidden rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-400">
          <div className="text-center">신청완료</div>
          <div className="text-center">예약확인</div>
          <div className="text-center">동행인 출발</div>
          <div className="text-center text-[var(--color-primary)]">동행 중</div>
        </div>

        {/* 지도 섹션 */}
        <Card className="p-0">
          <div className="relative h-[200px] w-full overflow-hidden rounded-t-2xl bg-gray-200">
            {/* 지도 이미지 플레이스홀더 */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-gray-500">
              지도 영역
            </span>
          </div>
          <Link to="#" className="flex justify-end p-4 text-[var(--color-primary)]">
            <span className="text-sm font-semibold">실시간 위치보기</span>
          </Link>
        </Card>

        {/* 동행 정보 섹션 */}
        <Card className="space-y-4">
          <h2 className="text-lg font-bold">동행 정보</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-gray-500">동행 목적지</span>
              <span className="font-semibold text-gray-800">{reservationDetails.destination}</span>
            </div>
            <Divider />
            <div className="flex justify-between text-base">
              <span className="text-gray-500">출발지</span>
              <span className="font-semibold text-gray-800">{reservationDetails.departure}</span>
            </div>
            <Divider />
            <div className="flex justify-between text-base">
              <span className="text-gray-500">동행 시간</span>
              <span className="font-semibold text-gray-800">{reservationDetails.time}</span>
            </div>
          </div>
        </Card>

        {/* 동행인 섹션 */}
        <Card>
          <div className="mb-4 text-base font-semibold text-gray-700">동행인</div>
          <div className="flex items-center justify-between p-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
                <svg className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate text-base font-bold">{reservationDetails.companion.name} 동행인</span>
                  <svg className="h-4 w-4 text-[#2F6BFF]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2l2.39 1.2 2.67-.36 1.46 2.3 2.48 1.1-.5 2.64.5 2.64-2.48 1.1-1.46 2.3-2.67-.36L10 18l-2.39-1.2-2.67.36-1.46-2.3L1 13.56l.5-2.64L1 8.28l2.48-1.1 1.46-2.3 2.67.36L10 2zm-1 11l5-5-1.41-1.41L9 9.17 7.41 7.59 6 9l3 4z" />
                  </svg>
                </div>
                <div className="truncate text-xs text-gray-500">{reservationDetails.companion.details}</div>
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
          </div>
        </Card>

        {/* 결제 금액 섹션 */}
        <Card className="flex justify-between">
          <span className="text-base font-bold text-gray-700">결제 금액</span>
          <span className="text-lg font-extrabold text-gray-800">{reservationDetails.paymentAmount} 원</span>
        </Card>
      </div>
    </MainLayout>
  );
}

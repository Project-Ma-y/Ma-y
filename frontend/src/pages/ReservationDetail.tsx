// src/pages/ReservationDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // useParams 훅 추가
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "axios"; // axios 라이브러리 추가
import { auth as firebaseAuth } from "@/services/firebase"; 

const BASE_URL = "https://ma-y-5usy.onrender.com/api/booking"; 

// 예약 데이터 타입 정의
interface BookingDetail {
  userId: string;
  familyId?: string;
  seniorId?: string;
  startBookingTime: string; // 예약일 ISO 8601
  endBookingTime: string; // 예약시간 ISO 8601
  departureAddress: string; // 출발지
  destinationAddress: string; //도착지
  roundTrip: boolean; //왕복이면 true
  assistanceType: 'guide' | 'admin' | 'shopping' | 'other'; //도움 유형
  additionalRequests?: string; //추가 요청
  userType: 'family' | 'senior';
  status: 'pending' | 'completed' | 'cancelled'; //상태
  price: number; // 총 금액 (단위: 원)
  isPaid: boolean; // 결제 여부
  paymentMethod?: 'card' | 'cash' | 'transfer'; // 결제 방식 (선택)
  paidAt?: string; // 결제 일시 (선택) ISO 8601
}

// 간단한 구분선 컴포넌트
const Divider = () => <div className="h-0.5 bg-gray-100"></div>;

export default function ReservationDetail() {
  const { id } = useParams<{ id: string }>(); // URL 파라미터에서 id 추출
  const [reservationDetails, setReservationDetails] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 예약 상세 정보를 가져오는 비동기 함수
useEffect(() => {
  const fetchReservation = async () => {
    if (!id) {
      setError("Reservation ID is missing.");
      setLoading(false);
      return;
    }
    try {
      const user = firebaseAuth.currentUser;                 // ✅ Firebase 사용자
      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();                 // ✅ Firebase ID 토큰

      const response = await axios.get(`${BASE_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: false,                               // ✅ 쿠키 포함
      });

      setReservationDetails(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.status === 404
          ? "예약을 찾을 수 없습니다."
          : err.response?.data?.message || "예약 정보를 불러오는데 실패했습니다.";
        setError(msg);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchReservation();
}, [id]);

  if (loading) {
    return (
      <MainLayout headerProps={{ title: "예약 내역", showBack: true }} showNav={true}>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <p>로딩 중...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout headerProps={{ title: "예약 내역", showBack: true }} showNav={true}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center text-red-500 p-4">
          <p>{error}</p>
          <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 bg-gray-200 rounded-md">
            뒤로가기
          </button>
        </div>
      </MainLayout>
    );
  }

  if (!reservationDetails) {
    return (
      <MainLayout headerProps={{ title: "예약 내역", showBack: true }} showNav={true}>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <p>예약 내역이 없습니다.</p>
        </div>
      </MainLayout>
    );
  }

  // ISO 8601 시간 형식을 '오후 2:00 ~ 오후 4:00' 형식으로 변환하는 함수
  const formatTimeRange = (start: string, end: string): string => {
    const formatTime = (isoString: string) => {
      const date = new Date(isoString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? '오후' : '오전';
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${ampm} ${formattedHours}:${formattedMinutes}`;
    };

    return `${formatTime(start)} ~ ${formatTime(end)}`;
  };
  
  // 상태 텍스트 매핑
  const statusMap: { [key: string]: string } = {
    pending: "예약확인",
    completed: "동행 완료",
    cancelled: "예약 취소",
    // API 응답에 'ongoing' 상태가 없으므로 임의로 추가하거나, 백엔드와 맞춰야 합니다.
  };

  const currentStatusText = statusMap[reservationDetails.status] || "알 수 없음";

  return (
    <MainLayout
      headerProps={{
        title: "예약 내역",
        showBack: true,
      }}
      showNav={true}
    >
      <div className="flex flex-col space-y-4">
        {/* 상단 탭 (진행 상태 표시) - API 데이터 기반으로 수정 필요 */}
        <div className="flex w-full justify-between overflow-hidden rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-400">
          <div className={clsx("text-center", { "text-[var(--color-primary)]": reservationDetails.status === 'pending' })}>
            신청완료
          </div>
          <div className={clsx("text-center", { "text-[var(--color-primary)]": reservationDetails.status === 'ongoing' })}>
            동행 중
          </div>
          <div className={clsx("text-center", { "text-[var(--color-primary)]": reservationDetails.status === 'completed' })}>
            동행 완료
          </div>
          <div className={clsx("text-center", { "text-[var(--color-primary)]": reservationDetails.status === 'cancelled' })}>
            예약 취소
          </div>
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
              <span className="font-semibold text-gray-800">{reservationDetails.destinationAddress}</span>
            </div>
            <Divider />
            <div className="flex justify-between text-base">
              <span className="text-gray-500">출발지</span>
              <span className="font-semibold text-gray-800">{reservationDetails.departureAddress}</span>
            </div>
            <Divider />
            <div className="flex justify-between text-base">
              <span className="text-gray-500">동행 시간</span>
              <span className="font-semibold text-gray-800">
                {formatTimeRange(reservationDetails.startBookingTime, reservationDetails.endBookingTime)}
              </span>
            </div>
            {/* 추가 요청사항이 있을 경우에만 표시 */}
            {reservationDetails.additionalRequests && (
              <>
                <Divider />
                <div className="flex justify-between text-base">
                  <span className="text-gray-500">추가 요청사항</span>
                  <span className="font-semibold text-gray-800">{reservationDetails.additionalRequests}</span>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* 동행인 섹션 - 동행인 정보는 API 응답에 없으므로 모의 데이터 유지 */}
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
                  <span className="truncate text-base font-bold">김이박 동행인</span>
                  <svg className="h-4 w-4 text-[#2F6BFF]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2l2.39 1.2 2.67-.36 1.46 2.3 2.48 1.1-.5 2.64.5 2.64-2.48 1.1-1.46 2.3-2.67-.36L10 18l-2.39-1.2-2.67.36-1.46-2.3L1 13.56l.5-2.64L1 8.28l2.48-1.1 1.46-2.3 2.67.36L10 2zm-1 11l5-5-1.41-1.41L9 9.17 7.41 7.59 6 9l3 4z" />
                  </svg>
                </div>
                <div className="truncate text-xs text-gray-500">정보, 한줄소개 또는 전화번호</div>
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

        
      </div>
    </MainLayout>
  );
}
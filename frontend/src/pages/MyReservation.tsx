// src/pages/MyReservations.tsx
import React, { useState, useEffect } from "react";
import Button from "@/components/button/Button";
import MainLayout from "@/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import ReservationCard from "@/components/ReservationCard";
import { useUserStore } from "@/store/userStore";
import { auth as firebaseAuth } from "@/services/firebase"; // Firebase auth 객체 임포트

// API의 기본 URL을 상수로 정의합니다.
// 테스트 파일에서 확인된 올바른 서버 주소입니다.
const BASE_URL = "https://ma-y-5usy.onrender.com/api/booking";

// ReservationCard 컴포넌트의 status 타입
type ReservationCardStatus = "reserved" | "ongoing" | "finished";

// API 응답 데이터에 대한 타입 정의
interface Reservation {
  userId: string;
  familyId?: string;
  seniorId?: string;
  startBookingTime: string; // 예약일 ISO 8601
  endBookingTime: string; // 예약시간 ISO 8601
  departureAddress: string; // 출발지
  destinationAddress: string; // 도착지
  roundTrip: boolean; // 왕복이면 true
  assistanceType: 'guide' | 'admin' | 'shopping' | 'other'; // 도움 유형
  additionalRequests?: string; // 추가 요청
  userType: 'family' | 'senior';
  status: 'pending' | 'completed' | 'cancelled'; // 상태
  price: number;         // 총 금액 (단위: 원)
  isPaid: boolean;       // 결제 여부
  paymentMethod?: 'card' | 'cash' | 'transfer'; // 결제 방식 (선택)
  paidAt?: string;       // 결제 일시 (선택) ISO 8601
}

export default function MyReservations() {
  const navigate = useNavigate();
  // Zustand 스토어에서 사용자 로그인 상태와 UID를 가져옵니다.
  const { isLoggedIn } = useUserStore();
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // API에서 예약 데이터를 불러오는 함수
  const fetchReservations = async () => {
    setIsLoading(true);
    // Firebase auth 객체에서 현재 사용자를 가져옵니다.
    const user = firebaseAuth.currentUser;
    if (!isLoggedIn || !user) {
      console.log("사용자가 로그인되지 않았습니다. 예약 정보를 불러올 수 없습니다.");
      setIsLoading(false);
      return;
    }

    try {
      // Firebase 인증 객체에서 토큰을 가져옵니다.
      const token = await user.getIdToken();
      
      const response = await fetch(`${BASE_URL}/my`, { // BASE_URL을 사용하여 올바른 API 엔드포인트 호출
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data: Reservation[] = await response.json();
        setReservations(data);
      } else {
        console.error(`예약 정보를 불러오는 데 실패했습니다. 상태: ${response.status}`);
        setReservations([]); // 실패 시 빈 배열로 설정하여 예약 없음 화면을 표시
      }
    } catch (error) {
      console.error("예약 정보를 불러오는 중 오류 발생:", error);
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트가 마운트되거나 로그인 상태가 변경될 때 데이터를 불러옵니다.
  useEffect(() => {
    if (isLoggedIn) {
      fetchReservations();
    } else {
      setIsLoading(false);
      setReservations([]);
    }
  }, [isLoggedIn]);

  const hasReservations = reservations.length > 0;

  // API 상태를 ReservationCard 컴포넌트의 상태로 변환하는 헬퍼 함수
  const mapStatusToCardStatus = (apiStatus: Reservation['status']): ReservationCardStatus => {
    switch (apiStatus) {
      case 'pending':
        return 'reserved';
      case 'completed':
      case 'cancelled':
        return 'finished';
      default:
        return 'finished'; // 기타 알 수 없는 상태는 'finished'로 처리
    }
  };

  // ISO 8601 날짜를 사용자 친화적인 텍스트로 변환하는 헬퍼 함수
  const formatDateToText = (isoString: string): string => {
    const date = new Date(isoString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    let datePrefix = '';
    if (date.toDateString() === today.toDateString()) {
      datePrefix = '오늘';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      datePrefix = '내일';
    } else {
      // 기타 날짜 포맷 (예: 10월 26일)
      const month = date.getMonth() + 1;
      const day = date.getDate();
      datePrefix = `${month}월 ${day}일`;
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${datePrefix} ${ampm} ${formattedHours}:${formattedMinutes}`;
  };

  return (
    <MainLayout
      headerProps={{
        title: "예약 내역",
        showBack: true
      }}
      showNav={true}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500">예약 정보를 불러오는 중...</p>
        </div>
      ) : hasReservations ? (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.startBookingTime + reservation.destinationAddress} // 고유 키 생성
              status={mapStatusToCardStatus(reservation.status)}
              dateText={formatDateToText(reservation.startBookingTime)}
              title={`${reservation.destinationAddress} 방문`}
              // 동행인 정보는 API 응답에 없으므로 임시로 '동행인' 문구 추가
              companionText={"동행인과 함께"} 
              onConfirm={() => console.log("예약 확인:", reservation.destinationAddress)}
              onCancel={() => console.log("예약 취소:", reservation.destinationAddress)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center px-6 pt-12">
          <div className="text-6xl text-gray-400 mb-6">
            <span role="img" aria-label="exclamation mark">❗️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">앗! 아직 예약하신 동행이 없어요.</h2>
          <p className="text-gray-500 mb-6">
            동행이 필요하신가요?<br />
            가까운 병원, 장보기, 관공서 어디든<br />
            함께 걸을 파트너를 예약해보세요!
          </p>
          <Button
            type="primary"
            buttonName="동행 예약 바로가기"
            onClick={() => navigate("/reservation")}
            className="w-full"
          />
        </div>
      )}
    </MainLayout>
  );
}

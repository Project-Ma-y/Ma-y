// src/pages/MyReservations.tsx
import React, { useState } from "react";
import Button from "@/components/button/Button";
import MainLayout from "@/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import ReservationCard from "@/components/ReservationCard";

type Status = "reserved" | "ongoing" | "finished";

export default function MyReservations() {
  const navigate = useNavigate();
  // 임시로 예약 목록 데이터 생성
  const [reservations, setReservations] = useState([
    { status: "reserved", dateText: "내일 오전 10:00", title: "서울 아산병원 방문", companionText: "김민정 동행인" },
    { status: "ongoing", dateText: "오늘 오전 10:00", title: "서울 아산병원 방문", companionText: "신미정 동행인" },
    { status: "finished", dateText: "어제 오전 10:00", title: "서울 아산병원 방문", companionText: "김신자 동행인" },
  ]);

  const hasReservations = reservations.length > 0;

  return (
    <MainLayout
      headerProps={{
        title: "예약 내역",
        showBack: true
      }}
      showNav={true}
    >
      {hasReservations ? (
        <div className="space-y-4">
          {reservations.map((reservation, index) => (
            <ReservationCard
              key={index}
              status={reservation.status as Status}
              dateText={reservation.dateText}
              title={reservation.title}
              companionText={reservation.companionText}
              onConfirm={() => console.log("예약 확인:", reservation.title)}
              onCancel={() => console.log("예약 취소:", reservation.title)}
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

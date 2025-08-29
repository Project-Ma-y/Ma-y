// src/pages/MyReservations.tsx
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/button/Button";
import MainLayout from "@/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import ReservationCard from "@/components/ReservationCard";
import { useUserStore } from "@/store/userStore";
import { auth as firebaseAuth } from "@/services/firebase";

const BASE_URL = "https://ma-y-5usy.onrender.com/api/booking";

type ReservationCardStatus = "reserved" | "ongoing" | "finished";

interface Reservation {
  _id?: string;                 // ← 안전하게 optional 처리(디버깅 목적)
  id?: string;                  // ← 혹시 백엔드가 id로 줄 수도 있으니 체크
  userId: string;
  familyId?: string;
  seniorId?: string;
  startBookingTime: string;
  endBookingTime: string;
  departureAddress: string;
  destinationAddress: string;
  roundTrip: boolean;
  assistanceType: "guide" | "admin" | "shopping" | "other";
  additionalRequests?: string;
  userType: "family" | "senior";
  status: "pending" | "completed" | "cancelled";
  price: number;
  isPaid: boolean;
  paymentMethod?: "card" | "cash" | "transfer";
  paidAt?: string;
}

// ───────────────────────────────────────────────────────────────────────────────
// 로그 유틸 (종류별)
// ───────────────────────────────────────────────────────────────────────────────
const tag = "[MyReservations]";

const logInfo = (...args: any[]) => console.info(tag, ...args);
const logDebug = (...args: any[]) => console.debug(tag, ...args);
const logWarn = (...args: any[]) => console.warn(tag, ...args);
const logError = (...args: any[]) => console.error(tag, ...args);

// ───────────────────────────────────────────────────────────────────────────────
// 상태 매핑
// ───────────────────────────────────────────────────────────────────────────────
const mapStatusToCardStatus = (apiStatus: Reservation["status"]): ReservationCardStatus => {
  switch (apiStatus) {
    case "pending":
      return "reserved";
    case "completed":
    case "cancelled":
      return "finished";
    default:
      return "reserved";
  }
};

// ───────────────────────────────────────────────────────────────────────────────
// 날짜 포맷
// ───────────────────────────────────────────────────────────────────────────────
const formatDateToText = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      logWarn("유효하지 않은 날짜 문자열:", isoString);
      return "유효하지 않은 날짜";
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    let prefix = "";
    if (date.toDateString() === today.toDateString()) prefix = "오늘";
    else if (date.toDateString() === tomorrow.toDateString()) prefix = "내일";
    else prefix = `${date.getMonth() + 1}월 ${date.getDate()}일`;

    const h = date.getHours();
    const m = date.getMinutes();
    const ampm = h >= 12 ? "오후" : "오전";
    const hh = h % 12 === 0 ? 12 : h % 12;
    const mm = m < 10 ? `0${m}` : `${m}`;
    return `${prefix} ${ampm} ${hh}:${mm}`;
  } catch (e) {
    logError("날짜 변환 중 오류:", e, "입력값:", isoString);
    return "날짜 오류";
  }
};

// ───────────────────────────────────────────────────────────────────────────────
// 안전한 ID 추출기(_id 우선, 없으면 id 시도)
// ───────────────────────────────────────────────────────────────────────────────
const pickReservationId = (r: Reservation): string | undefined => {
  return r?._id ?? r?.id ?? undefined;
};

// ───────────────────────────────────────────────────────────────────────────────
// 컴포넌트
// ───────────────────────────────────────────────────────────────────────────────
export default function MyReservations() {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 최초 로드/로그인 상태 변화 시 목록 요청
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);

      const user = firebaseAuth.currentUser;
      if (!isLoggedIn || !user) {
        logWarn("로그인 상태가 아니거나 Firebase user가 없음 → 목록 요청 중단");
        setIsLoading(false);
        setReservations([]);
        return;
      }

      try {
        const token = await user.getIdToken();
        logDebug("Firebase ID 토큰 준비 완료(앞 10자):", token.slice(0, 10) + "...");

        const url = `${BASE_URL}/my`;
        logInfo("예약 목록 요청 시작:", url);

        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // credentials: "include",
        });

        logDebug("예약 목록 응답 상태:", resp.status);

        if (!resp.ok) {
          logError("예약 목록 요청 실패 - status:", resp.status);
          setReservations([]);
          return;
        }

        const data: Reservation[] = await resp.json();
        logInfo("예약 원본 데이터 수:", data?.length ?? 0);

        // 각 아이템 로그(종류별 상세)
        data?.forEach((item, idx) => {
          const rid = pickReservationId(item);
          console.groupCollapsed(`${tag} 예약 아이템 [${idx}]`);
          logDebug("원본 아이템:", item);
          if (!rid) logWarn("이 아이템은 예약 ID가 없습니다.(_id도 id도 없음)");
          else logInfo("추출된 예약 ID:", rid);
          logDebug("startBookingTime:", item.startBookingTime, "→", formatDateToText(item.startBookingTime));
          logDebug("status:", item.status, "→", mapStatusToCardStatus(item.status));
          console.groupEnd();
        });

        // 정렬
        const sorted = Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                new Date(b.startBookingTime).getTime() - new Date(a.startBookingTime).getTime()
            )
          : [];

        logInfo("정렬 후 데이터 수:", sorted?.length ?? 0);

        setReservations(sorted);
      } catch (err) {
        logError("예약 목록 요청 중 예외 발생:", err);
        setReservations([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) fetchReservations();
    else {
      setIsLoading(false);
      setReservations([]);
    }
  }, [isLoggedIn]);

  // id 유효성 통계 로그
  const idStats = useMemo(() => {
    const totals = reservations.length;
    const withId = reservations.filter((r) => !!pickReservationId(r)).length;
    const withoutId = totals - withId;
    return { totals, withId, withoutId };
  }, [reservations]);

  useEffect(() => {
    logInfo("ID 통계 → 총:", idStats.totals, "| ID 있음:", idStats.withId, "| ID 없음:", idStats.withoutId);
    if (idStats.withoutId > 0) {
      logWarn("일부 예약에 ID가 없습니다. 서버 응답 스키마 확인 필요(_id 또는 id).");
    }
  }, [idStats]);

  const handleGoDetail = (rid?: string) => {
    if (!rid) {
      logError("상세 페이지 이동 중단: 예약 ID가 없습니다.");
      return;
    }
    const path = `/reservation/${rid}`;
    logInfo("상세 페이지로 이동:", path);
    navigate(path);
  };

  const hasReservations = reservations.length > 0;

  return (
    <MainLayout
      headerProps={{
        title: "예약 내역",
        showBack: true,
      }}
      showNav={true}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500">예약 정보를 불러오는 중...</p>
        </div>
      ) : hasReservations ? (
        <div className="space-y-4">
          {reservations.map((reservation, idx) => {
            const rid = pickReservationId(reservation);

            // 렌더 직전에 한 번 더 강한 로그
            if (!rid) {
              logWarn(`렌더 스킵: [${idx}] 예약에 유효한 ID가 없습니다.`, reservation);
              return (
                <div
                  key={`no-id-${idx}`}
                  className="rounded-xl border border-red-200 p-4 text-sm text-red-600"
                >
                  이 예약 아이템에는 ID가 없어 상세 이동이 불가합니다. (콘솔 로그 참조)
                </div>
              );
            }

            return (
              <ReservationCard
                key={rid}
                id={rid} // ← 반드시 전달
                status={mapStatusToCardStatus(reservation.status)}
                dateText={formatDateToText(reservation.startBookingTime)}
                title={`${reservation.destinationAddress} 방문`}
                companionText={"김이박 동행인"}
                onConfirm={() => handleGoDetail(rid)}
                onCancel={() => logInfo("예약 취소 클릭:", rid)}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center px-6 pt-12">
          <div className="text-6xl text-gray-400 mb-6">
            <span role="img" aria-label="exclamation mark">
              ❗️
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2">앗! 아직 예약하신 동행이 없어요.</h2>
          <p className="text-gray-500 mb-6">
            동행이 필요하신가요?
            <br />
            가까운 병원, 장보기, 관공서 어디든
            <br />
            함께 걸을 파트너를 예약해보세요!
          </p>
          <Button
            type="primary"
            buttonName="동행 예약 바로가기"
            onClick={() => {
              logInfo("동행 예약 바로가기 클릭 → /reservation");
              navigate("/reservation");
            }}
            className="w-full"
          />
        </div>
      )}
    </MainLayout>
  );
}

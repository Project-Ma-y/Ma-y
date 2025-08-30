// src/pages/MyReservations.tsx
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/button/Button";
import MainLayout from "@/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import ReservationCard from "@/components/ReservationCard";
import { useUserStore } from "@/store/userStore";
import { api } from "@/lib/api"; // ✅ 단일 인스턴스 사용
import { getAuth } from "firebase/auth";

type ReservationCardStatus = "reserved" | "ongoing" | "finished";

interface Reservation {
  _id?: string;
  id?: string;
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

// 로그 유틸
const tag = "[MyReservations]";
const logInfo = (...args: any[]) => console.info(tag, ...args);
const logDebug = (...args: any[]) => console.debug(tag, ...args);
const logWarn = (...args: any[]) => console.warn(tag, ...args);
const logError = (...args: any[]) => console.error(tag, ...args);

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

const pickReservationId = (r: Reservation): string | undefined => {
  return r?._id ?? r?.id ?? undefined;
};

export default function MyReservations() {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("예약이 취소되었습니다.");

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);

      if (!isLoggedIn) {
        logWarn("로그인 상태가 아님 → 목록 요청 중단");
        setIsLoading(false);
        setReservations([]);
        return;
      }

      try {
        // ✅ 토큰은 인터셉터에서 자동 부착(환경에 따라 아래 주석 해제 가능)
        const resp = await api.get<Reservation[]>("/booking/my"); 
        const data = resp.data ?? [];
        logInfo("예약 원본 데이터 수:", data?.length ?? 0);

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

  // ✅ 예약 취소
  const handleCancelReservation = async (rid?: string) => {
    try {
      if (!rid) throw new Error("예약 ID가 없습니다.");

      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("로그인이 필요합니다.");

      const params: Record<string, any> = {};
      // 서버 요구에 따라 mid가 필요하면 주석 해제
      // const mid = undefined; // 선택 mid가 있다면 세팅
      // if (mid) params.mid = mid;

      await api.delete(`/booking/${rid}`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // 쿠키 포함
      });

      // 목록에서 제거
      setReservations((prev) => prev.filter((r) => (r._id ?? r.id) !== rid));

      // 성공 모달
      setModalMsg("예약이 취소되었습니다.");
      setIsModalOpen(true);
    } catch (e) {
      console.error("예약 취소 실패:", e);
      setModalMsg("예약 취소에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setIsModalOpen(true);
    }
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
      {/* ✅ 성공/실패 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-center text-base">{modalMsg}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500">예약 정보를 불러오는 중...</p>
        </div>
      ) : hasReservations ? (
        <div className="space-y-4">
          {reservations.map((reservation, idx) => {
            const rid = pickReservationId(reservation);

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
                id={rid}
                status={mapStatusToCardStatus(reservation.status)}
                dateText={formatDateToText(reservation.startBookingTime)}
                title={`${reservation.destinationAddress} 방문`}
                companionText={"매칭 대기중"}
                onConfirm={() => handleGoDetail(rid)}
                onCancel={() => handleCancelReservation(rid)}  // ✅ 취소 → 모달
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

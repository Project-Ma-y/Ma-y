// src/pages/ReservationDetail.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import clsx from "clsx";
import { api } from "@/lib/api";
import { loadNaverMap } from "@/utils/loadNaverMap";

// ===== Types =====
interface SeniorProfile {
  memberId?: string;
  name?: string;
  nickname?: string;
  phone?: string;
  phoneNumber?: string;
  gender?: "male" | "female" | string;
  birthdate?: string;
  avatarUrl?: string;
}

interface BookingDetail {
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
  status: "pending" | "completed" | "cancelled" | "ongoing";
  price: number;
  isPaid: boolean;
  paymentMethod?: "card" | "cash" | "transfer";
  paidAt?: string;
  seniorProfile?: SeniorProfile;

  departureCoord?: { lat: number; lng: number } | null;
  destinationCoord?: { lat: number; lng: number } | null;
}

// ===== UI helpers =====
const Divider = () => <div className="h-0.5 bg-gray-100" />;

const weekdayKo = ["일", "월", "화", "수", "목", "금", "토"];
const toDateStr = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  const w = weekdayKo[d.getDay()];
  return `${y}.${m}.${day} (${w})`;
};
const toClock = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const h = d.getHours();
  const m = `${d.getMinutes()}`.padStart(2, "0");
  const ampm = h >= 12 ? "오후" : "오전";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${hh}:${m}`;
};
const formatDateTimeRange = (startISO: string, endISO: string) =>
  `${toDateStr(startISO)} ${toClock(startISO)} ~ ${toClock(endISO)}`;

/** ===== 지도 섹션 ===== */
function MapSection({
  departureAddress,
  destinationAddress,
  departureCoord,
  destinationCoord,
}: {
  departureAddress: string;
  destinationAddress: string;
  departureCoord?: { lat: number; lng: number } | null;
  destinationCoord?: { lat: number; lng: number } | null;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<any>(null);
  const depMarkerRef = useRef<any>(null);
  const dstMarkerRef = useRef<any>(null);
  const lineRef = useRef<any>(null);

  // 주소 → 좌표
  const geocode = (q: string): Promise<{ lat: number; lng: number } | null> =>
    new Promise((resolve) => {
      const { naver } = window as any;
      if (!q?.trim()) return resolve(null);
      const call = (opts: any) =>
        new Promise<any[]>((res) =>
          naver.maps.Service.geocode(opts, (status: any, resp: any) => {
            if (status !== naver.maps.Service.Status.OK) return res([]);
            res(resp?.v2?.addresses ?? []);
          })
        );
      (async () => {
        let list = await call({ query: q });
        if (!list.length) list = await call({ address: q });
        if (!list.length) return resolve(null);
        const v = list[0];
        resolve({ lat: Number(v.y), lng: Number(v.x) });
      })();
    });

  useEffect(() => {
    let cleanup: any;
    let io: IntersectionObserver | null = null;

    const initMap = async () => {
      await loadNaverMap();
      const { naver } = window as any;

      if (!mapRef.current) return;

      // 컨테이너가 실크기 갖출 때까지 대기
      const ensureSize = () =>
        new Promise<void>((r) => {
          let tries = 0;
          const tick = () => {
            tries++;
            const w = mapRef.current!.clientWidth;
            const h = mapRef.current!.clientHeight;
            if (w > 0 && h > 0) return r();
            if (tries > 10) return r(); // 최대 1s
            setTimeout(tick, 100);
          };
          tick();
        });
      await ensureSize();

      const map = new naver.maps.Map(mapRef.current!, {
        center: new naver.maps.LatLng(37.5666805, 126.9784147),
        zoom: 14,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
      });
      mapObj.current = map;

      // 최초 보정
      setTimeout(() => naver.maps.Event.trigger(map, "resize"), 0);

      const iconBlue =
        '<div style="padding:4px 8px;border-radius:12px;background:#2563eb;color:#fff;font-size:12px">출발</div>';
      const iconGreen =
        '<div style="padding:4px 8px;border-radius:12px;background:#16a34a;color:#fff;font-size:12px">도착</div>';

      // 좌표 확보 (백엔드 제공 → 없으면 지오코딩)
      const dep =
        departureCoord ??
        (await geocode(departureAddress).catch(() => null));
      const dst =
        destinationCoord ??
        (await geocode(destinationAddress).catch(() => null));

      if (dep) {
        depMarkerRef.current = new naver.maps.Marker({
          position: new naver.maps.LatLng(dep.lat, dep.lng),
          map,
          icon: { content: iconBlue, anchor: new naver.maps.Point(20, 20) },
        });
      }
      if (dst) {
        dstMarkerRef.current = new naver.maps.Marker({
          position: new naver.maps.LatLng(dst.lat, dst.lng),
          map,
          icon: { content: iconGreen, anchor: new naver.maps.Point(20, 20) },
        });
      }

      if (dep && dst) {
        const bounds = new naver.maps.LatLngBounds(
          new naver.maps.LatLng(dep.lat, dep.lng),
          new naver.maps.LatLng(dst.lat, dst.lng)
        );
        map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
        lineRef.current = new naver.maps.Polyline({
          map,
          path: [
            new naver.maps.LatLng(dep.lat, dep.lng),
            new naver.maps.LatLng(dst.lat, dst.lng),
          ],
          strokeWeight: 4,
          strokeOpacity: 0.7,
          strokeColor: "#2563eb",
        });
      } else if (dep) {
        map.setCenter(new naver.maps.LatLng(dep.lat, dep.lng));
      } else if (dst) {
        map.setCenter(new naver.maps.LatLng(dst.lat, dst.lng));
      }

      // 가시성 변경 시 resize
      if (wrapRef.current) {
        io = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && mapObj.current) {
              naver.maps.Event.trigger(mapObj.current, "resize");
            }
          });
        });
        io.observe(wrapRef.current);
      }

      cleanup = () => {
        depMarkerRef.current && depMarkerRef.current.setMap(null);
        dstMarkerRef.current && dstMarkerRef.current.setMap(null);
        lineRef.current && lineRef.current.setMap(null);
        mapObj.current = null;
      };
    };

    initMap();

    return () => {
      cleanup && cleanup();
      io && io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departureAddress, destinationAddress, departureCoord, destinationCoord]);

  return (
    <div ref={wrapRef} className="relative h-[220px] w-full overflow-hidden rounded-t-2xl">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
}

export default function ReservationDetail() {
  const { id } = useParams<{ id: string }>();
  const [reservationDetails, setReservationDetails] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== Fetch booking detail =====
  useEffect(() => {
    const fetchReservation = async () => {
      if (!id) {
        setError("Reservation ID is missing.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/booking/${id}`);

        const raw = response.data;
        const normalized: BookingDetail = {
          userId: raw.userId ?? raw.user_id,
          familyId: raw.familyId ?? raw.family_id,
          seniorId: raw.seniorId ?? raw.senior_id,
          startBookingTime: raw.startBookingTime ?? raw.start_booking_time,
          endBookingTime: raw.endBookingTime ?? raw.end_booking_time,
          departureAddress: raw.departureAddress ?? raw.departure_address,
          destinationAddress: raw.destinationAddress ?? raw.destination_address,
          roundTrip: raw.roundTrip ?? raw.round_trip ?? false,
          assistanceType: raw.assistanceType ?? raw.assistance_type ?? "other",
          additionalRequests: raw.additionalRequests ?? raw.additional_requests,
          userType: raw.userType ?? raw.user_type ?? "family",
          status: raw.status ?? "pending",
          price: raw.price ?? 0,
          isPaid: raw.isPaid ?? raw.is_paid ?? false,
          paymentMethod: raw.paymentMethod ?? raw.payment_method,
          paidAt: raw.paidAt ?? raw.paid_at,
          seniorProfile: raw.seniorProfile ?? raw.senior_profile,
          departureCoord: raw.departureCoord ?? raw.departure_coord ?? null,
          destinationCoord: raw.destinationCoord ?? raw.destination_coord ?? null,
        };

        setReservationDetails(normalized);
      } catch (err: any) {
        const msg =
          err?.response?.status === 404
            ? "예약을 찾을 수 없습니다."
            : err?.response?.data?.message || "예약 정보를 불러오는데 실패했습니다.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  const statusMap = useMemo(
    () => ({
      pending: "예약확인",
      ongoing: "동행 중",
      completed: "동행 완료",
      cancelled: "예약 취소",
    }),
    []
  );

  const seniorName = useMemo(() => {
    if (!reservationDetails?.seniorProfile) return "-";
    const s = reservationDetails.seniorProfile;
    return s.nickname || s.name || "이름없음";
  }, [reservationDetails?.seniorProfile]);

  const seniorPhone = useMemo(() => {
    if (!reservationDetails?.seniorProfile) return "-";
    const s = reservationDetails.seniorProfile;
    return s.phone || s.phoneNumber || "-";
  }, [reservationDetails?.seniorProfile]);

  const seniorGender = useMemo(() => {
    if (!reservationDetails?.seniorProfile?.gender) return "";
    const g = reservationDetails.seniorProfile.gender;
    return g === "male" ? "M" : g === "female" ? "F" : "";
  }, [reservationDetails?.seniorProfile]);

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
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
          >
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

  return (
    <MainLayout
      headerProps={{
        type: "header-a",
        title: "예약 내역",
      }}
      showNav={false}
    >
      <div className="flex flex-col space-y-4">
        {/* 진행 상태 */}
        <div className="flex w-full justify-between overflow-hidden rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-400">
          <div
            className={clsx("text-center", {
              "text-[var(--color-primary)]": reservationDetails.status === "pending",
            })}
          >
            신청완료
          </div>
          <div
            className={clsx("text-center", {
              "text-[var(--color-primary)]": reservationDetails.status === "ongoing",
            })}
          >
            동행 중
          </div>
          <div
            className={clsx("text-center", {
              "text-[var(--color-primary)]": reservationDetails.status === "completed",
            })}
          >
            동행 완료
          </div>
          <div
            className={clsx("text-center", {
              "text-[var(--color-primary)]": reservationDetails.status === "cancelled",
            })}
          >
            예약 취소
          </div>
        </div>

        {/* 지도 섹션 */}
        <Card className="p-0">
          <MapSection
            departureAddress={reservationDetails.departureAddress}
            destinationAddress={reservationDetails.destinationAddress}
            departureCoord={reservationDetails.departureCoord}
            destinationCoord={reservationDetails.destinationCoord}
          />
          <Link to="#" className="flex justify-end p-4 text-[var(--color-primary)]">
            <span className="text-sm font-semibold">실시간 위치보기</span>
          </Link>
        </Card>

        {/* 동행할 시니어 정보 */}
        {reservationDetails.seniorProfile && (
          <Card>
            <div className="mb-4 text-base font-semibold text-gray-700">동행할 시니어</div>
            <div className="flex items-center justify-between p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                  {reservationDetails.seniorProfile.avatarUrl ? (
                    <img
                      src={reservationDetails.seniorProfile.avatarUrl}
                      alt="avatar"
                      className="h-12 w-12 object-cover"
                    />
                  ) : (
                    <svg className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
                    </svg>
                  )}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-base font-bold">{seniorName}</span>
                    <span className="text-xs text-gray-500">{seniorGender}</span>
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    {seniorPhone}
                    {reservationDetails.seniorProfile.birthdate
                      ? ` · 생년월일 ${reservationDetails.seniorProfile.birthdate}`
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 동행 정보 */}
        <Card className="space-y-4">
          <h2 className="text-lg font-bold">동행 정보</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-gray-500">동행 목적지</span>
              <span className="font-semibold text-gray-800">
                {reservationDetails.destinationAddress}
              </span>
            </div>
            <Divider />
            <div className="flex justify-between text-base">
              <span className="text-gray-500">출발지</span>
              <span className="font-semibold text-gray-800">
                {reservationDetails.departureAddress}
              </span>
            </div>
            <Divider />
            {/* 동행 날짜 + 시간 */}
            <div className="flex justify-between text-base">
              <span className="text-gray-500">동행 일시</span>
              <span className="font-semibold text-gray-800 text-right">
                {formatDateTimeRange(
                  reservationDetails.startBookingTime,
                  reservationDetails.endBookingTime
                )}
              </span>
            </div>
            {reservationDetails.additionalRequests && (
              <>
                <Divider />
                <div className="flex justify-between text-base">
                  <span className="text-gray-500">추가 요청사항</span>
                  <span className="font-semibold text-gray-800">
                    {reservationDetails.additionalRequests}
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* 결제/상태 요약 */}
        <Card className="space-y-3">
          <h2 className="text-lg font-bold">결제 및 상태</h2>
          <div className="flex justify-between text-base">
            <span className="text-gray-500">상태</span>
            <span className="font-semibold text-gray-800">
              {statusMap[reservationDetails.status] ?? "알 수 없음"}
            </span>
          </div>
          <Divider />
          <div className="flex justify-between text-base">
            <span className="text-gray-500">총 금액</span>
            <span className="font-semibold text-gray-800">
              {reservationDetails.price?.toLocaleString()}원
            </span>
          </div>
          <Divider />
          <div className="flex justify-between text-base">
            <span className="text-gray-500">결제 여부</span>
            <span className="font-semibold text-gray-800">
              {reservationDetails.isPaid ? "결제 대기" : "미결제"}
            </span>
          </div>
          {reservationDetails.isPaid && reservationDetails.paidAt && (
            <>
              <Divider />
              <div className="flex justify-between text-base">
                <span className="text-gray-500">결제 일시</span>
                <span className="font-semibold text-gray-800">
                  {toDateStr(reservationDetails.paidAt)} {toClock(reservationDetails.paidAt)}
                </span>
              </div>
            </>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

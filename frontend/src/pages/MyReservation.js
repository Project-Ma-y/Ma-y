import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/MyReservations.tsx
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/button/Button";
import MainLayout from "@/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import ReservationCard from "@/components/ReservationCard";
import { useUserStore } from "@/store/userStore";
import { auth as firebaseAuth } from "@/services/firebase";
const BASE_URL = "https://ma-y-5usy.onrender.com/api/booking";
// ───────────────────────────────────────────────────────────────────────────────
// 로그 유틸 (종류별)
// ───────────────────────────────────────────────────────────────────────────────
const tag = "[MyReservations]";
const logInfo = (...args) => console.info(tag, ...args);
const logDebug = (...args) => console.debug(tag, ...args);
const logWarn = (...args) => console.warn(tag, ...args);
const logError = (...args) => console.error(tag, ...args);
// ───────────────────────────────────────────────────────────────────────────────
// 상태 매핑
// ───────────────────────────────────────────────────────────────────────────────
const mapStatusToCardStatus = (apiStatus) => {
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
const formatDateToText = (isoString) => {
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
        if (date.toDateString() === today.toDateString())
            prefix = "오늘";
        else if (date.toDateString() === tomorrow.toDateString())
            prefix = "내일";
        else
            prefix = `${date.getMonth() + 1}월 ${date.getDate()}일`;
        const h = date.getHours();
        const m = date.getMinutes();
        const ampm = h >= 12 ? "오후" : "오전";
        const hh = h % 12 === 0 ? 12 : h % 12;
        const mm = m < 10 ? `0${m}` : `${m}`;
        return `${prefix} ${ampm} ${hh}:${mm}`;
    }
    catch (e) {
        logError("날짜 변환 중 오류:", e, "입력값:", isoString);
        return "날짜 오류";
    }
};
// ───────────────────────────────────────────────────────────────────────────────
// 안전한 ID 추출기(_id 우선, 없으면 id 시도)
// ───────────────────────────────────────────────────────────────────────────────
const pickReservationId = (r) => {
    return r?._id ?? r?.id ?? undefined;
};
// ───────────────────────────────────────────────────────────────────────────────
// 컴포넌트
// ───────────────────────────────────────────────────────────────────────────────
export default function MyReservations() {
    const navigate = useNavigate();
    const { isLoggedIn } = useUserStore();
    const [reservations, setReservations] = useState([]);
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
                const data = await resp.json();
                logInfo("예약 원본 데이터 수:", data?.length ?? 0);
                // 각 아이템 로그(종류별 상세)
                data?.forEach((item, idx) => {
                    const rid = pickReservationId(item);
                    console.groupCollapsed(`${tag} 예약 아이템 [${idx}]`);
                    logDebug("원본 아이템:", item);
                    if (!rid)
                        logWarn("이 아이템은 예약 ID가 없습니다.(_id도 id도 없음)");
                    else
                        logInfo("추출된 예약 ID:", rid);
                    logDebug("startBookingTime:", item.startBookingTime, "→", formatDateToText(item.startBookingTime));
                    logDebug("status:", item.status, "→", mapStatusToCardStatus(item.status));
                    console.groupEnd();
                });
                // 정렬
                const sorted = Array.isArray(data)
                    ? [...data].sort((a, b) => new Date(b.startBookingTime).getTime() - new Date(a.startBookingTime).getTime())
                    : [];
                logInfo("정렬 후 데이터 수:", sorted?.length ?? 0);
                setReservations(sorted);
            }
            catch (err) {
                logError("예약 목록 요청 중 예외 발생:", err);
                setReservations([]);
            }
            finally {
                setIsLoading(false);
            }
        };
        if (isLoggedIn)
            fetchReservations();
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
    const handleGoDetail = (rid) => {
        if (!rid) {
            logError("상세 페이지 이동 중단: 예약 ID가 없습니다.");
            return;
        }
        const path = `/reservation/${rid}`;
        logInfo("상세 페이지로 이동:", path);
        navigate(path);
    };
    const hasReservations = reservations.length > 0;
    return (_jsx(MainLayout, { headerProps: {
            title: "예약 내역",
            showBack: true,
        }, showNav: true, children: isLoading ? (_jsx("div", { className: "flex justify-center items-center h-48", children: _jsx("p", { className: "text-gray-500", children: "\uC608\uC57D \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911..." }) })) : hasReservations ? (_jsx("div", { className: "space-y-4", children: reservations.map((reservation, idx) => {
                const rid = pickReservationId(reservation);
                // 렌더 직전에 한 번 더 강한 로그
                if (!rid) {
                    logWarn(`렌더 스킵: [${idx}] 예약에 유효한 ID가 없습니다.`, reservation);
                    return (_jsx("div", { className: "rounded-xl border border-red-200 p-4 text-sm text-red-600", children: "\uC774 \uC608\uC57D \uC544\uC774\uD15C\uC5D0\uB294 ID\uAC00 \uC5C6\uC5B4 \uC0C1\uC138 \uC774\uB3D9\uC774 \uBD88\uAC00\uD569\uB2C8\uB2E4. (\uCF58\uC194 \uB85C\uADF8 \uCC38\uC870)" }, `no-id-${idx}`));
                }
                return (_jsx(ReservationCard, { id: rid, status: mapStatusToCardStatus(reservation.status), dateText: formatDateToText(reservation.startBookingTime), title: `${reservation.destinationAddress} 방문`, companionText: "김이박 동행인", onConfirm: () => handleGoDetail(rid), onCancel: () => logInfo("예약 취소 클릭:", rid) }, rid));
            }) })) : (_jsxs("div", { className: "flex flex-col items-center justify-center text-center px-6 pt-12", children: [_jsx("div", { className: "text-6xl text-gray-400 mb-6", children: _jsx("span", { role: "img", "aria-label": "exclamation mark", children: "\u2757\uFE0F" }) }), _jsx("h2", { className: "text-2xl font-bold mb-2", children: "\uC557! \uC544\uC9C1 \uC608\uC57D\uD558\uC2E0 \uB3D9\uD589\uC774 \uC5C6\uC5B4\uC694." }), _jsxs("p", { className: "text-gray-500 mb-6", children: ["\uB3D9\uD589\uC774 \uD544\uC694\uD558\uC2E0\uAC00\uC694?", _jsx("br", {}), "\uAC00\uAE4C\uC6B4 \uBCD1\uC6D0, \uC7A5\uBCF4\uAE30, \uAD00\uACF5\uC11C \uC5B4\uB514\uB4E0", _jsx("br", {}), "\uD568\uAED8 \uAC78\uC744 \uD30C\uD2B8\uB108\uB97C \uC608\uC57D\uD574\uBCF4\uC138\uC694!"] }), _jsx(Button, { type: "primary", buttonName: "\uB3D9\uD589 \uC608\uC57D \uBC14\uB85C\uAC00\uAE30", onClick: () => {
                        logInfo("동행 예약 바로가기 클릭 → /reservation");
                        navigate("/reservation");
                    }, className: "w-full" })] })) }));
}

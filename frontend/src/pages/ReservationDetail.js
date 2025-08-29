import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/ReservationDetail.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // useParams 훅 추가
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "axios"; // axios 라이브러리 추가
import { auth as firebaseAuth } from "@/services/firebase";
const BASE_URL = "https://ma-y-5usy.onrender.com/api/booking";
// 간단한 구분선 컴포넌트
const Divider = () => _jsx("div", { className: "h-0.5 bg-gray-100" });
export default function ReservationDetail() {
    const { id } = useParams(); // URL 파라미터에서 id 추출
    const [reservationDetails, setReservationDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // 예약 상세 정보를 가져오는 비동기 함수
    useEffect(() => {
        const fetchReservation = async () => {
            if (!id) {
                setError("Reservation ID is missing.");
                setLoading(false);
                return;
            }
            try {
                const user = firebaseAuth.currentUser; // ✅ Firebase 사용자
                if (!user) {
                    setError("로그인이 필요합니다.");
                    setLoading(false);
                    return;
                }
                const token = await user.getIdToken(); // ✅ Firebase ID 토큰
                const response = await axios.get(`${BASE_URL}/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: false, // ✅ 쿠키 포함
                });
                setReservationDetails(response.data);
            }
            catch (err) {
                if (axios.isAxiosError(err)) {
                    const msg = err.response?.status === 404
                        ? "예약을 찾을 수 없습니다."
                        : err.response?.data?.message || "예약 정보를 불러오는데 실패했습니다.";
                    setError(msg);
                }
                else {
                    setError("An unexpected error occurred.");
                }
            }
            finally {
                setLoading(false);
            }
        };
        fetchReservation();
    }, [id]);
    if (loading) {
        return (_jsx(MainLayout, { headerProps: { title: "예약 내역", showBack: true }, showNav: true, children: _jsx("div", { className: "flex justify-center items-center h-[calc(100vh-80px)]", children: _jsx("p", { children: "\uB85C\uB529 \uC911..." }) }) }));
    }
    if (error) {
        return (_jsx(MainLayout, { headerProps: { title: "예약 내역", showBack: true }, showNav: true, children: _jsxs("div", { className: "flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center text-red-500 p-4", children: [_jsx("p", { children: error }), _jsx("button", { onClick: () => window.history.back(), className: "mt-4 px-4 py-2 bg-gray-200 rounded-md", children: "\uB4A4\uB85C\uAC00\uAE30" })] }) }));
    }
    if (!reservationDetails) {
        return (_jsx(MainLayout, { headerProps: { title: "예약 내역", showBack: true }, showNav: true, children: _jsx("div", { className: "flex justify-center items-center h-[calc(100vh-80px)]", children: _jsx("p", { children: "\uC608\uC57D \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) }) }));
    }
    // ISO 8601 시간 형식을 '오후 2:00 ~ 오후 4:00' 형식으로 변환하는 함수
    const formatTimeRange = (start, end) => {
        const formatTime = (isoString) => {
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
    const statusMap = {
        pending: "예약확인",
        completed: "동행 완료",
        cancelled: "예약 취소",
        // API 응답에 'ongoing' 상태가 없으므로 임의로 추가하거나, 백엔드와 맞춰야 합니다.
    };
    const currentStatusText = statusMap[reservationDetails.status] || "알 수 없음";
    return (_jsx(MainLayout, { headerProps: {
            title: "예약 내역",
            showBack: true,
        }, showNav: true, children: _jsxs("div", { className: "flex flex-col space-y-4", children: [_jsxs("div", { className: "flex w-full justify-between overflow-hidden rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-400", children: [_jsx("div", { className: clsx("text-center", { "text-[var(--color-primary)]": reservationDetails.status === 'pending' }), children: "\uC2E0\uCCAD\uC644\uB8CC" }), _jsx("div", { className: clsx("text-center", { "text-[var(--color-primary)]": reservationDetails.status === 'ongoing' }), children: "\uB3D9\uD589 \uC911" }), _jsx("div", { className: clsx("text-center", { "text-[var(--color-primary)]": reservationDetails.status === 'completed' }), children: "\uB3D9\uD589 \uC644\uB8CC" }), _jsx("div", { className: clsx("text-center", { "text-[var(--color-primary)]": reservationDetails.status === 'cancelled' }), children: "\uC608\uC57D \uCDE8\uC18C" })] }), _jsxs(Card, { className: "p-0", children: [_jsx("div", { className: "relative h-[200px] w-full overflow-hidden rounded-t-2xl bg-gray-200", children: _jsx("span", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-gray-500", children: "\uC9C0\uB3C4 \uC601\uC5ED" }) }), _jsx(Link, { to: "#", className: "flex justify-end p-4 text-[var(--color-primary)]", children: _jsx("span", { className: "text-sm font-semibold", children: "\uC2E4\uC2DC\uAC04 \uC704\uCE58\uBCF4\uAE30" }) })] }), _jsxs(Card, { className: "space-y-4", children: [_jsx("h2", { className: "text-lg font-bold", children: "\uB3D9\uD589 \uC815\uBCF4" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between text-base", children: [_jsx("span", { className: "text-gray-500", children: "\uB3D9\uD589 \uBAA9\uC801\uC9C0" }), _jsx("span", { className: "font-semibold text-gray-800", children: reservationDetails.destinationAddress })] }), _jsx(Divider, {}), _jsxs("div", { className: "flex justify-between text-base", children: [_jsx("span", { className: "text-gray-500", children: "\uCD9C\uBC1C\uC9C0" }), _jsx("span", { className: "font-semibold text-gray-800", children: reservationDetails.departureAddress })] }), _jsx(Divider, {}), _jsxs("div", { className: "flex justify-between text-base", children: [_jsx("span", { className: "text-gray-500", children: "\uB3D9\uD589 \uC2DC\uAC04" }), _jsx("span", { className: "font-semibold text-gray-800", children: formatTimeRange(reservationDetails.startBookingTime, reservationDetails.endBookingTime) })] }), reservationDetails.additionalRequests && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsxs("div", { className: "flex justify-between text-base", children: [_jsx("span", { className: "text-gray-500", children: "\uCD94\uAC00 \uC694\uCCAD\uC0AC\uD56D" }), _jsx("span", { className: "font-semibold text-gray-800", children: reservationDetails.additionalRequests })] })] }))] })] }), _jsxs(Card, { children: [_jsx("div", { className: "mb-4 text-base font-semibold text-gray-700", children: "\uB3D9\uD589\uC778" }), _jsxs("div", { className: "flex items-center justify-between p-3", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [_jsx("span", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200", children: _jsx("svg", { className: "h-6 w-6 text-gray-500", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" }) }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "truncate text-base font-bold", children: "\uAE40\uC774\uBC15 \uB3D9\uD589\uC778" }), _jsx("svg", { className: "h-4 w-4 text-[#2F6BFF]", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M10 2l2.39 1.2 2.67-.36 1.46 2.3 2.48 1.1-.5 2.64.5 2.64-2.48 1.1-1.46 2.3-2.67-.36L10 18l-2.39-1.2-2.67.36-1.46-2.3L1 13.56l.5-2.64L1 8.28l2.48-1.1 1.46-2.3 2.67.36L10 2zm-1 11l5-5-1.41-1.41L9 9.17 7.41 7.59 6 9l3 4z" }) })] }), _jsx("div", { className: "truncate text-xs text-gray-500", children: "\uC815\uBCF4, \uD55C\uC904\uC18C\uAC1C \uB610\uB294 \uC804\uD654\uBC88\uD638" })] })] }), _jsx("svg", { className: "h-5 w-5 text-gray-400", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M9 18l6-6-6-6" }) })] })] })] }) }));
}

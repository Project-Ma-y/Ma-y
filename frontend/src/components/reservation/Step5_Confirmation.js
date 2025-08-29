import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/reservation/Step5_Confirmation.tsx
import { useMemo } from "react";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import { useUserStore } from "@/store/userStore";
import Modal from "@/components/Modal";
import { createBooking } from "@/services/bookingApi";
import { toISO } from "@/utils/datetime";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { getAuth } from "firebase/auth";
import { api } from "@/lib/api";
const weekdayKo = ["일", "월", "화", "수", "목", "금", "토"];
const formatYMDWeek = (iso) => {
    if (!iso)
        return "";
    const d = new Date(iso);
    if (isNaN(d.getTime()))
        return "";
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const w = weekdayKo[d.getDay()];
    return `${y}년 ${m}월 ${day}일 ${w}요일`;
};
const mapAssistance = (types = []) => {
    const label = {
        guide: "길안내 및 이동 보조",
        admin: "접수 및 행정 보조",
        shopping: "장보기 보조",
        other: "기타",
    };
    return types.map(t => label[t] || t).join(", ");
};
const Step5_Confirmation = ({ formData, onNext, onPrev, setStep }) => {
    const { profile } = useUserStore();
    const navigate = useNavigate();
    const ui = useUIStore();
    // 예약자(로그인 사용자) 정보
    const reserver = useMemo(() => {
        return {
            name: profile?.name ?? profile?.registeredFamily?.[0]?.name ?? "이름없음",
            phone: profile?.phone ?? profile?.registeredFamily?.[0]?.phoneNumber ?? "",
        };
    }, [profile]);
    // Step1에서 저장한 스냅샷 사용
    const selectedUser = formData?.selectedUser || null;
    const dateLine = formatYMDWeek(formData?.selectedDate);
    const timeLine = formData?.startTime && formData?.endTime
        ? `${formData.startTime} ~ ${formData.endTime}`
        : "";
    // 예약 제출 핸들러
    const handleReserve = async () => {
        // formData → 백엔드 스키마 변환
        const startISO = toISO(formData?.selectedDate, formData?.startTime);
        const endISO = toISO(formData?.selectedDate, formData?.endTime);
        // assistanceType은 단일 문자열로 보냄(여러 개라면 첫 번째, 없으면 'other')
        const assistanceType = Array.isArray(formData?.assistanceTypes) && formData.assistanceTypes.length > 0
            ? formData.assistanceTypes[0]
            : "other";
        const payload = {
            startBookingTime: startISO,
            endBookingTime: endISO,
            departureAddress: formData?.departureAddress || "",
            destinationAddress: formData?.destinationAddress || "",
            roundTrip: !!formData?.roundTrip,
            assistanceType,
            additionalRequests: formData?.additionalRequests || "",
        };
        const u = getAuth().currentUser;
        const t = u ? await u.getIdToken() : "";
        console.debug("[reserve] token head:", t ? t.slice(0, 12) + "…" : "(no user)");
        console.debug("[reserve] api.baseURL=", api.defaults.baseURL, "withCredentials=", api.defaults.withCredentials);
        try {
            const { bookingId } = await createBooking(payload);
            // 성공 모달
            ui.openModal("reserve-success");
            // 필요시 페이지 이동
            // navigate(`/reservation/${bookingId}`);
        }
        catch (e) {
            console.error("[createBooking error]", e);
            ui.openModal("reserve-fail");
        }
    };
    return (_jsxs(Card, { className: "p-0", children: [_jsxs("div", { className: "p-4 space-y-6", children: [_jsx("h2", { className: "text-xl font-bold mb-1", children: "\uC785\uB825\uD558\uC2E0 \uB0B4\uC6A9\uC774 \uB9DE\uB098\uC694?" }), _jsx("p", { className: "text-sm text-yellow-500", children: "\uC548\uC2EC\uD558\uACE0 \uC774\uC6A9\uD558\uC2E4 \uC218 \uC788\uB3C4\uB85D \uC815\uBCF4\uB4E4\uC744 \uB2E4\uC2DC \uD55C \uBC88 \uD655\uC778\uD574\uC8FC\uC138\uC694." }), _jsxs("div", { className: "border-b pb-4", children: [_jsx("h3", { className: "text-base font-semibold text-gray-800 mb-3", children: "\uC608\uC57D\uD558\uC2DC\uB294 \uBD84" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500", children: _jsx("svg", { className: "h-8 w-8", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" }) }) }), _jsxs("div", { children: [_jsx("div", { className: "font-bold flex items-center gap-1", children: reserver.name }), _jsx("div", { className: "text-sm text-gray-500", children: reserver.phone })] })] })] }), _jsxs("div", { className: "flex justify-between items-center border-b pb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-gray-800 mb-3", children: "\uB3D9\uD589\uC774 \uD544\uC694\uD55C \uBD84" }), selectedUser ? (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500", children: _jsx("svg", { className: "h-8 w-8", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" }) }) }), _jsxs("div", { children: [_jsx("div", { className: "font-bold", children: selectedUser.name }), _jsxs("div", { className: "text-sm text-gray-500", children: [selectedUser.relation, " | \uC804\uD654\uBC88\uD638 ", selectedUser.phone || "없음"] })] })] })) : (_jsx("div", { className: "text-sm text-gray-500", children: "\uC120\uD0DD\uB41C \uBCF4\uD638 \uB300\uC0C1\uC790\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }))] }), _jsx("button", { onClick: () => setStep(1), className: "text-blue-500 text-sm font-medium", children: "\uC218\uC815" })] }), _jsxs("div", { className: "flex justify-between items-center border-b pb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-gray-800 mb-3", children: "\uC77C\uC2DC" }), _jsxs("p", { className: "font-medium", children: [dateLine && _jsxs(_Fragment, { children: [dateLine, _jsx("br", {})] }), timeLine] })] }), _jsx("button", { onClick: () => setStep(2), className: "text-blue-500 text-sm font-medium", children: "\uC218\uC815" })] }), _jsxs("div", { className: "flex justify-between items-center border-b pb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-gray-800 mb-3", children: "\uC7A5\uC18C" }), _jsxs("p", { className: "font-medium", children: ["\uCD9C\uBC1C\uC9C0 : ", formData?.departureAddress || "-", _jsx("br", {}), "\uBAA9\uC801\uC9C0 : ", formData?.destinationAddress || "-"] })] }), _jsx("button", { onClick: () => setStep(3), className: "text-blue-500 text-sm font-medium", children: "\uC218\uC815" })] }), _jsxs("div", { className: "flex justify-between items-center pb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-gray-800 mb-3", children: "\uCD94\uAC00 \uC815\uBCF4" }), _jsxs("p", { className: "font-medium", children: [formData?.roundTrip ? "왕복" : "편도", _jsx("br", {}), mapAssistance(formData?.assistanceTypes), formData?.additionalRequests && (_jsxs(_Fragment, { children: [_jsx("br", {}), formData.additionalRequests] }))] })] }), _jsx("button", { onClick: () => setStep(4), className: "text-blue-500 text-sm font-medium", children: "\uC218\uC815" })] })] }), _jsx("div", { className: "flex justify-center p-4 bg-gray-50 border-t", children: _jsx(Button, { onClick: () => ui.openModal("reserve-confirm"), buttonName: "\uC608\uC57D\uD558\uAE30", type: "primary" }) }), _jsx(Modal, { id: "reserve-confirm", variant: "notice", title: "\uC608\uC57D\uC744 \uC9C4\uD589\uD560\uAE4C\uC694?", subtext: "\uC785\uB825\uD55C \uC815\uBCF4\uB85C \uC608\uC57D\uC744 \uC0DD\uC131\uD569\uB2C8\uB2E4.", confirmText: "\uC608, \uC608\uC57D\uD558\uAE30", showCancel: true, cancelText: "\uC218\uC815\uD560\uAC8C\uC694", onConfirm: handleReserve, acknowledgeLabel: "\uC548\uB0B4\uC0AC\uD56D\uC744 \uD655\uC778\uD588\uC2B5\uB2C8\uB2E4.", children: _jsx("p", { className: "text-sm leading-6", children: "\uACB0\uC81C \uBC0F \uC608\uC57D \uD655\uC815 \uC808\uCC28\uB294 \uC548\uB0B4\uC5D0 \uB530\uB77C \uC9C4\uD589\uB429\uB2C8\uB2E4." }) }), _jsx(Modal, { id: "reserve-success", variant: "success", title: "\uC608\uC57D\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4", subtext: "\uB0B4 \uC608\uC57D\uC5D0\uC11C \uC0C1\uC138\uB97C \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694.", confirmText: "\uB0B4 \uC608\uC57D \uBCF4\uAE30", onConfirm: () => navigate("/my-reservation") }), _jsx(Modal, { id: "reserve-fail", variant: "warning", title: "\uC608\uC57D\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4", subtext: "\uB124\uD2B8\uC6CC\uD06C \uB610\uB294 \uC778\uC99D \uC0C1\uD0DC\uB97C \uD655\uC778\uD55C \uB4A4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.", confirmText: "\uD655\uC778" })] }));
};
export default Step5_Confirmation;

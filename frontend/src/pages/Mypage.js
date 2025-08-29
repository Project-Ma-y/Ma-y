import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/MyPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Card from "@/components/Card";
import ReservationCard from "@/components/ReservationCard";
import clsx from "clsx";
import { getAuth, signOut } from "firebase/auth";
const BASE_URL = "https://ma-y-5usy.onrender.com/api/booking";
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
const formatDateToText = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime()))
        return "유효하지 않은 날짜";
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
};
export default function MyPage() {
    const navigate = useNavigate();
    const { profile, isLoggedIn, isUserLoading, isProfileLoading, fetchUserProfile, } = useUserStore();
    // 보호대상자 관리 페이지로 초기값 전달
    const openParentsManage = () => {
        if (!profile)
            return;
        const prefill = (profile.registeredFamily ?? []).map((p) => ({
            mid: p.memberId, // 서버 식별자
            name: p.name ?? "",
            phone: p.phone ?? "",
            gender: p.gender ?? "",
            birthdate: p.birthdate ?? "",
            relation: p.relation ?? "",
        }));
        navigate("/parents/manage", { state: { parents: prefill } });
    };
    const [reservations, setReservations] = useState([]);
    const [isResLoading, setIsResLoading] = useState(true);
    useEffect(() => {
        if (isLoggedIn) {
            const run = async () => {
                setIsResLoading(true);
                try {
                    const auth = getAuth();
                    const current = auth.currentUser;
                    if (!current) {
                        setReservations([]);
                        return;
                    }
                    const token = await current.getIdToken();
                    const resp = await fetch(`${BASE_URL}/my`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (!resp.ok) {
                        setReservations([]);
                        return;
                    }
                    const data = await resp.json();
                    const sorted = data.sort((a, b) => new Date(b.startBookingTime).getTime() - new Date(a.startBookingTime).getTime());
                    setReservations(sorted);
                }
                catch {
                    setReservations([]);
                }
                finally {
                    setIsResLoading(false);
                }
            };
            run();
        }
        else {
            setReservations([]);
            setIsResLoading(false);
        }
    }, [isLoggedIn]);
    useEffect(() => {
        if (isLoggedIn && !profile && !isProfileLoading) {
            fetchUserProfile();
        }
    }, [isLoggedIn, profile, isProfileLoading, fetchUserProfile]);
    const handleLogout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
        }
        catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };
    const recentReservation = useMemo(() => reservations[0], [reservations]);
    const menuItems = [
        { label: "함께한 동행인", path: "/accompanying-partners" },
        { label: "문의 내역", path: "/inquiries" },
        { label: "결제 수단 관리", path: "/payment-methods" },
    ];
    const guideItems = [
        { label: "공지사항", path: "/announcements" },
        { label: "웹 버전", version: "1.0.0 (beta)" },
    ];
    const renderProfile = () => {
        if (isUserLoading || isProfileLoading) {
            return (_jsx("div", { className: "flex flex-col items-center justify-center min-h-screen", children: _jsx("p", { className: "text-xl text-gray-700", children: "\uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911..." }) }));
        }
        if (!isLoggedIn) {
            return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen", children: [_jsx("p", { className: "text-xl text-gray-700", children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4." }), _jsx(Link, { to: "/login", className: "mt-4 text-blue-500 hover:underline", children: "\uB85C\uADF8\uC778\uD558\uAE30" })] }));
        }
        if (!profile) {
            return (_jsx("div", { className: "flex flex-col items-center justify-center min-h-screen", children: _jsx("p", { className: "text-xl text-red-500", children: "\uD504\uB85C\uD544 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4." }) }));
        }
        // 사용자 이름은 항상 사용자 본인의 이름
        const profileName = profile.name;
        // ✅ 역할 판별: 보호자/시니어
        const isFamilyUser = profile.customerType === "family";
        const isSeniorUser = profile.customerType === "senior";
        const seniorsList = Array.isArray(profile.registeredFamily)
            ? profile.registeredFamily
            : [];
        const hasSeniors = seniorsList.length > 0;
        const isGuardian = profile.role === "guardian" || profile.customerType === "family";
        return (_jsxs(_Fragment, { children: [_jsxs(Card, { className: "flex items-center gap-4 p-4", children: [_jsx("span", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-gray-200", children: profile.profileImage ? (_jsx("img", { src: profile.profileImage, alt: "Profile", className: "h-16 w-16 rounded-full" })) : (_jsx("svg", { className: "h-10 w-10 text-gray-500", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" }) })) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "text-xl font-bold", children: profileName }), _jsx("span", { className: "rounded-md bg-[var(--color-primary)]/15 px-1.5 py-0.5 text-xs font-bold text-[var(--color-primary)]", children: isFamilyUser ? "보호자" : "시니어" }), _jsxs(Link, { to: "/profile/edit", className: "flex items-center text-gray-500 ml-auto cursor-pointer text-sm", children: [_jsx("span", { className: "mr-1", children: "\uC218\uC815\uD558\uAE30" }), _jsx("svg", { className: "h-5 w-5 text-gray-500", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" }) })] })] }), _jsx("div", { className: "text-sm text-gray-500 mt-1", children: profile.phone }), isFamilyUser && (_jsx("div", { className: "text-xs text-gray-500 mt-1", children: hasSeniors ? `시니어 - ${seniorsList.length}명` : "등록한 가족이 없습니다." }))] })] }), isFamilyUser && (_jsxs("div", { className: "mt-6 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm font-semibold text-gray-700", children: ["\uC2DC\uB2C8\uC5B4 (", seniorsList.length, "\uBA85)"] }), _jsx("button", { onClick: openParentsManage, children: _jsx("svg", { className: "h-5 w-5 text-gray-400 hover:text-[var(--color-primary)] transition-colors", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M9 18l6-6-6-6" }) }) })] }), hasSeniors ? (seniorsList.map((senior, index) => (_jsx(Link, { to: "#", children: _jsx(Card, { className: "flex items-center justify-between p-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200", children: _jsx("svg", { className: "h-5 w-5 text-gray-500", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" }) }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "truncate text-sm font-bold", children: senior.name }), _jsx("span", { className: "rounded-md bg-[var(--color-primary)]/15 px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-primary)]", children: senior.gender === "male" ? "M" : senior.gender === "female" ? "F" : "" })] }), _jsx("div", { className: "truncate text-xs text-gray-500", children: senior.phone })] })] }) }) }, index)))) : (
                        // ✅ 0명일 때도 섹션 내 안내 카드 표시 (문구 유지)
                        _jsx(Card, { className: "p-4", children: _jsx("div", { className: "text-sm text-gray-600", children: "\uB4F1\uB85D\uD55C \uAC00\uC871\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) }))] })), _jsxs("div", { className: "mt-6 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm font-semibold text-gray-700", children: ["\uC774\uC6A9 \uD604\uD669 (", reservations.length, "\uAC74)"] }), _jsx("button", { className: "text-xs text-gray-500 underline", onClick: () => navigate("/my-reservation"), children: "\uC804\uCCB4 \uBCF4\uAE30" })] }), isResLoading ? (_jsx("div", { className: "flex justify-center items-center h-24", children: _jsx("p", { className: "text-gray-500", children: "\uC608\uC57D \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911..." }) })) : recentReservation ? (_jsx(ReservationCard, { id: recentReservation._id, status: mapStatusToCardStatus(recentReservation.status), dateText: formatDateToText(recentReservation.startBookingTime), title: `${recentReservation.destinationAddress} 방문`, companionText: "김이박 동행인", onConfirm: () => navigate(`/reservation/${recentReservation._id}`), onCancel: () => navigate(`/reservation/${recentReservation._id}`) })) : (_jsxs(Card, { className: "p-4", children: [_jsx("div", { className: "text-sm text-gray-600", children: "\uCD5C\uADFC \uC608\uC57D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uCCAB \uC608\uC57D\uC744 \uC9C4\uD589\uD574\uBCF4\uC138\uC694." }), _jsx("button", { className: "mt-3 text-sm font-semibold text-[var(--color-primary)] underline", onClick: () => navigate("/reservation"), children: "\uB3D9\uD589 \uC608\uC57D \uBC14\uB85C\uAC00\uAE30" })] }))] }), _jsx("div", { className: "mt-6 space-y-3", children: menuItems.map((item, index) => (_jsx(Link, { to: item.path, className: "block", children: _jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 py-4", children: [_jsx("span", { className: "text-base font-semibold text-gray-700", children: item.label }), _jsx("svg", { className: "h-5 w-5 text-gray-400", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M9 18l6-6-6-6" }) })] }) }, index))) }), _jsxs("div", { className: "mt-6 space-y-3", children: [_jsx("div", { className: "text-sm font-semibold text-gray-700", children: "\uAC00\uC774\uB4DC" }), guideItems.map((item, index) => (_jsxs("div", { className: clsx("flex items-center justify-between py-4", {
                                "border-b border-gray-200": item.path,
                            }), children: [item.path ? (_jsx(Link, { to: item.path, className: "flex-1", children: _jsx("span", { className: "text-base font-semibold text-gray-700", children: item.label }) })) : (_jsx("span", { className: "flex-1 text-base font-semibold text-gray-700", children: item.label })), item.version ? (_jsx("span", { className: "text-sm text-gray-400", children: item.version })) : (_jsx("svg", { className: "h-5 w-5 text-gray-400", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M9 18l6-6-6-6" }) }))] }, index)))] }), _jsx("div", { className: "mt-6", children: _jsx("button", { onClick: handleLogout, className: "w-full flex items-center justify-center border-b border-gray-200 py-4 text-base font-semibold text-gray-700 hover:text-red-500 transition-colors duration-200", children: "\uB85C\uADF8\uC544\uC6C3" }) })] }));
    };
    return (_jsx(MainLayout, { headerProps: {
            title: "내 정보",
            showBack: false,
            right: (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { "aria-label": "\uC54C\uB9BC", children: _jsx("svg", { className: "h-6 w-6 text-gray-800", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M12 2a6 6 0 0 0-6 6v3.586l-1.707 1.707A1 1 0 0 0 5 15h14a1 1 0 0 0 .707-1.707L18 11.586V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z" }) }) }), _jsx("button", { "aria-label": "\uC124\uC815", children: _jsxs("svg", { className: "h-6 w-6 text-gray-800", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-2.83 2.83a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-.09a1 1 0 0 0-1-.19 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0L3.5 17.5a2 2 0 0 1 0-2.83l.06-.06a1 1 0 0 0 .33-1.82v-.09a1 1 0 0 0-1.51-1H3a2 2 0 0 1-2-2v-1.9a2 2 0 0 1 2-2h.09a1 1 0 0 0 .19-1 1 1 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83L6.5 3.5a2 2 0 0 1 2.83 0l.06.06a1 1 0 0 0 1.82.33H12a2 2 0 0 1 2 2v.09a1 1 0 0 0 1 .19 1 1 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0l2.83 2.83a2 2 0 0 1 0 2.83l-.06.06a1 1 0 0 0-.33 1.82v.09a1 1 0 0 0 1.51 1H21a2 2 0 0 1 2 2v1.9a2 2 0 0 1-2 2h-.09a1 1 0 0 0-.19 1Z" }), _jsx("circle", { cx: "12", cy: "12", r: "3" })] }) })] })),
        }, showNav: true, children: _jsx("div", { className: "", children: renderProfile() }) }));
}

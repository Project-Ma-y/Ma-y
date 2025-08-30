import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Card from "@/components/Card";
import Button from "@/components/button/Button";
import clsx from "clsx";
import { Link } from "react-router-dom"; // Link 컴포넌트 임포트
const statusLabel = {
    reserved: { text: "예약완료", className: "text-[#2F6BFF]" },
    ongoing: { text: "동행중", className: "text-[var(--color-primary)]" },
    finished: { text: "동행완료", className: "text-[#16A34A]" },
};
export default function ReservationCard({ id, // props에서 id를 받음
status, dateText, title, companionText = "ㅇㅇㅇ 동행인", onConfirm, onCancel, }) {
    const s = statusLabel[status];
    const isReserved = status === "reserved";
    return (
    // Card 전체를 Link 컴포넌트로 감싸 클릭 시 상세 페이지로 이동하도록 설정
    _jsx(Link, { to: `/reservation/${id}`, children: _jsxs(Card, { className: "relative space-y-4", children: [_jsx("svg", { className: "absolute right-4 top-4 h-6 w-6 text-gray-400", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M9 18l6-6-6-6" }) }), _jsxs("div", { className: "flex items-center gap-3 pr-8", children: [_jsx("span", { className: clsx("text-lg font-extrabold", s.className), children: s.text }), _jsx("span", { className: "text-lg text-gray-400", children: dateText })] }), _jsx("h3", { className: "text-2xl font-extrabold text-black", children: title }), _jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx("span", { className: "flex h-7 w-7 items-center justify-center rounded-full bg-gray-200", children: _jsx("svg", { className: "h-4 w-4 text-gray-500", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" }) }) }), _jsx("span", { className: "text-base", children: companionText })] }), isReserved ? (_jsxs("div", { className: "mt-2 grid grid-cols-2 gap-5", children: [_jsx(Button, { type: "primary", buttonName: "\uC608\uC57D\uD655\uC778", onClick: (e) => {
                                e.preventDefault(); // Link의 기본 동작(페이지 이동) 방지
                                if (onConfirm)
                                    onConfirm();
                            }, className: "h-16 w-full rounded-3xl text-2xl" }), _jsx(Button, { type: "secondary", buttonName: "\uC608\uC57D\uCDE8\uC18C", onClick: (e) => {
                                e.preventDefault(); // Link의 기본 동작(페이지 이동) 방지
                                if (onCancel)
                                    onCancel();
                            }, className: "h-16 w-full rounded-3xl text-2xl" })] })) : (_jsx("div", { className: "mt-2", children: _jsx(Button, { type: "close", buttonName: "\uC608\uC57D \uCDE8\uC18C\uD558\uAE30", onClick: (e) => {
                            e.preventDefault(); // Link의 기본 동작(페이지 이동) 방지
                            if (onCancel)
                                onCancel();
                        }, className: "h-16 w-full rounded-3xl text-2xl" }) }))] }) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Home.tsx
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/button/Button";
import Card from "@/components/Card";
import { useNavigate } from "react-router-dom";
export default function Home() {
    const nav = useNavigate();
    return (_jsxs(MainLayout, { headerProps: {
            type: "default",
        }, children: [_jsx("div", { className: "overflow-hidden rounded-2xl", children: _jsx("div", { className: "relative h-full bg-gray-200", children: _jsx("img", { src: "/public/assets/img/may_1.png", alt: "" }) }) }), _jsxs(Card, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "mt-1 inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-primary)]/15", children: _jsx("svg", { className: "h-4 w-4 text-[var(--color-primary)]", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M7 2a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-1V3a1 1 0 1 0-2 0v1H8V3a1 1 0 0 0-1-1Zm13 7H4v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9Z" }) }) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-lg font-extrabold", children: "\uB3D9\uD589 \uC608\uC57D\uD558\uAE30" }), _jsx("div", { className: "mt-1 text-sm text-gray-500", children: "\uAF2D \uD544\uC694\uD55C \uC815\uBCF4\uB4E4\uB9CC \uC785\uB825\uD558\uC138\uC694!" })] })] }), _jsx(Button, { type: "primary", className: "h-12 w-full rounded-2xl text-lg", buttonName: "\uC608\uC57D\uD558\uAE30", onClick: () => nav("/reservation") })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "text-sm font-semibold text-gray-700", children: "\uB3D9\uD589\uC778 \uCD94\uCC9C" }), _jsx(CompanionListItem, { name: "\uAE40\uCF69\uC950 \uB3D9\uD589\uC778", sub: "\uC815\uBCF4, \uD55C\uC904\uC18C\uAC1C \uB610\uB294 \uC804\uD654\uBC88\uD638", onClick: () => nav("/profile/1") }), _jsx(CompanionListItem, { name: "\uAE40\uD325\uC950 \uB3D9\uD589\uC778", sub: "\uC815\uBCF4, \uD55C\uC904\uC18C\uAC1C \uB610\uB294 \uC804\uD654\uBC88\uD638", onClick: () => nav("/profile/2") })] })] }));
}
function CompanionListItem({ name, sub, onClick, }) {
    return (_jsx("button", { type: "button", onClick: onClick, className: "w-full text-left", "aria-label": `${name} 프로필로 이동`, children: _jsxs(Card, { className: "flex items-center justify-between p-3", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [_jsx("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200", children: _jsx("svg", { className: "h-5 w-5 text-gray-500", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" }) }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "truncate text-sm font-bold", children: name }), _jsx("svg", { className: "h-3.5 w-3.5 text-[#2F6BFF]", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M10 2l2.39 1.2 2.67-.36 1.46 2.3 2.48 1.1-.5 2.64.5 2.64-2.48 1.1-1.46 2.3-2.67-.36L10 18l-2.39-1.2-2.67.36-1.46-2.3L1 13.56l.5-2.64L1 8.28l2.48-1.1 1.46-2.3 2.67.36L10 2zm-1 11l5-5-1.41-1.41L9 9.17 7.41 7.59 6 9l3 4z" }) })] }), _jsx("div", { className: "truncate text-xs text-gray-500", children: sub })] })] }), _jsx("svg", { className: "h-5 w-5 text-gray-400", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M9 18l6-6-6-6" }) })] }) }));
}
function TabIcon({ label, active = false }) {
    return (_jsxs("div", { className: "flex flex-col items-center gap-1", children: [_jsx("div", { className: [
                    "flex h-10 w-10 items-center justify-center rounded-2xl border",
                    active
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                        : "border-gray-200 text-gray-400",
                ].join(" "), children: _jsx("svg", { className: "h-5 w-5", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M12 3l9 8h-3v9H6v-9H3l9-8Z" }) }) }), _jsx("div", { className: [
                    "text-[11px]",
                    active ? "text-[var(--color-primary)] font-semibold" : "text-gray-400",
                ].join(" "), children: label })] }));
}

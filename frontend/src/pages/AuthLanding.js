import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/AuthLanding.tsx
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/button/Button";
import { useNavigate } from "react-router-dom";
export default function AuthLanding() {
    const nav = useNavigate();
    return (_jsx(MainLayout
    // ✅ headerProps, showNav를 false로 설정하여 헤더와 내비게이션 숨김
    , { 
        // ✅ headerProps, showNav를 false로 설정하여 헤더와 내비게이션 숨김
        headerProps: { showHeader: false }, showNav: false, contentBg: "bg-white", children: _jsxs("div", { className: "flex flex-col items-center justify-between h-full", children: [_jsxs("div", { className: "flex flex-col items-center mt-8", children: [_jsx("div", { className: "text-[44px] font-extrabold leading-none text-[var(--color-primary)]", children: "Ma:y" }), _jsx("div", { className: "mt-1 text-[10px] tracking-wide text-[var(--color-primary)]", children: "Make it easy" }), _jsx("div", { className: "mt-12 text-[15px] font-extrabold text-black", children: "\uC2DC\uB2C8\uC5B4 \uC0DD\uD65C \uD1B5\uD569 \uC194\uB8E8\uC158" })] }), _jsxs("div", { className: "w-full space-y-3 pb-12 mt-10", children: [_jsx(Button, { type: "primary", buttonName: "\uD68C\uC6D0\uAC00\uC785", className: "w-full h-14 rounded-2xl text-lg", onClick: () => nav("/signup") }), _jsx(Button, { type: "secondary", buttonName: "\uB85C\uADF8\uC778", className: "w-full h-14 rounded-2xl text-lg", onClick: () => nav("/login") })] })] }) }));
}

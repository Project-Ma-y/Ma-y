import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/NotFound.tsx
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/button/Button";
import { useNavigate } from "react-router-dom";
export default function NotFound() {
    const nav = useNavigate();
    return (_jsx(MainLayout, { headerProps: { title: "페이지 없음", showBack: true }, children: _jsxs("div", { className: "flex flex-1 flex-col items-center justify-center gap-3", children: [_jsx("div", { className: "text-xl font-extrabold", children: "404 Not Found" }), _jsx("div", { className: "text-sm text-gray-500", children: "\uC694\uCCAD\uD558\uC2E0 \uD398\uC774\uC9C0\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }), _jsx(Button, { type: "primary", buttonName: "\uD648\uC73C\uB85C", onClick: () => nav("/") })] }) }));
}

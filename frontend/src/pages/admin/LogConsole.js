import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/admin/LogConsole.tsx
import Card from "@/components/Card";
export default function LogConsole({ log }) {
    return (_jsxs(Card, { className: "h-full", children: [_jsx("div", { className: "text-sm font-semibold", children: "Response Log" }), _jsx("pre", { className: "mt-2 h-full min-h-[200px] overflow-auto rounded-lg bg-gray-900 text-white p-3 text-xs font-mono", children: log || "API 테스트 결과가 여기에 표시됩니다." })] }));
}

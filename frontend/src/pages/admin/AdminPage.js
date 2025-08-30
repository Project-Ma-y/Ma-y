import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/admin/AdminPage.tsx
import { useState } from "react";
import { api } from "@/lib/axios";
import StatChartCard from "./StatChartCard";
import EndpointTable from "./EndpointTable";
import LogConsole from "./LogConsole";
export default function AdminPage() {
    const [log, setLog] = useState("");
    const [loadingEndpoint, setLoadingEndpoint] = useState(null);
    // 엔드포인트 테스트 함수
    const handleTestEndpoint = async (path) => {
        try {
            setLoadingEndpoint(path);
            setLog(`[GET] ${path} 요청 중...`);
            const res = await api.get(path);
            const responseData = typeof res.data === "object" ? JSON.stringify(res.data, null, 2) : String(res.data);
            setLog(`[GET] ${path}\n✅ 응답 성공:\n${responseData}`);
        }
        catch (e) {
            const msg = e?.response?.data?.message ?? e?.message ?? "알 수 없는 에러";
            setLog(`[GET] ${path}\n❌ 에러 발생:\n${msg}`);
        }
        finally {
            setLoadingEndpoint(null);
        }
    };
    return (_jsxs("div", { className: "bg-gray-50 min-h-screen flex text-gray-800", children: [_jsxs("aside", { className: "w-64 bg-white p-6 border-r border-gray-200", children: [_jsx("h1", { className: "text-2xl font-bold text-blue-600", children: "Ma-y Admin" }), _jsx("nav", { className: "mt-8", children: _jsx("a", { href: "/admin", className: "block py-2 px-4 rounded bg-blue-50 text-blue-600 font-semibold", children: "\uB300\uC2DC\uBCF4\uB4DC" }) })] }), _jsxs("main", { className: "flex-1 p-8 overflow-auto", children: [_jsxs("header", { className: "flex items-center justify-between pb-6 border-b border-gray-200", children: [_jsx("h2", { className: "text-3xl font-extrabold", children: "\uB300\uC2DC\uBCF4\uB4DC" }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 text-sm font-semibold text-gray-600 bg-white border rounded-lg hover:bg-gray-100 transition", children: "\uC0C8\uB85C\uACE0\uCE68" })] }), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8", children: [_jsx(StatChartCard, { title: "\uD68C\uC6D0\uAC00\uC785 \uC804\uD658\uC728", endpoint: "/api/stats/signup-conversion" }), _jsx(StatChartCard, { title: "\uB3D9\uD589 \uC2E0\uCCAD \uB3C4\uB2EC\uC728", endpoint: "/api/stats/application-reach" }), _jsx(StatChartCard, { title: "\uB3D9\uD589 \uC2E0\uCCAD \uC804\uD658\uC728", endpoint: "/api/stats/application-conversion" })] }), _jsxs("section", { className: "grid grid-cols-1 xl:grid-cols-5 gap-6 mt-8", children: [_jsx("div", { className: "xl:col-span-3", children: _jsx(EndpointTable, { onTest: handleTestEndpoint, loadingEndpoint: loadingEndpoint }) }), _jsx("div", { className: "xl:col-span-2", children: _jsx(LogConsole, { log: log }) })] })] })] }));
}

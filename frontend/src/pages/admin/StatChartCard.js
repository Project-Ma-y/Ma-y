import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/admin/StatChartCard.tsx
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "@/components/Card";
import { api } from "@/lib/axios";
export default function StatChartCard({ title, endpoint }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(endpoint);
            // ✅ 응답 데이터가 숫자인지 확인하고 차트 형식에 맞게 변환
            if (typeof res.data === 'number') {
                // 소수점인 전환율(0.1)을 퍼센트(10%)로 변환
                const value = Math.round(res.data * 100);
                // recharts 라이브러리가 요구하는 배열 형태로 변환
                const chartData = [{ date: title.split(' ')[0], value: value }];
                setData(chartData);
            }
            else {
                // 숫자가 아닌 경우 에러 처리
                setError("데이터 형식이 올바르지 않습니다.");
                setData([]);
            }
        }
        catch (e) {
            setError("데이터를 불러오는데 실패했습니다.");
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [endpoint]);
    return (_jsxs(Card, { className: "p-4 h-80 flex flex-col", children: [_jsx("h3", { className: "font-bold", children: title }), _jsxs("div", { className: "flex-grow mt-4", children: [loading && _jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: "\uB85C\uB529 \uC911..." }), error && _jsx("div", { className: "flex items-center justify-center h-full text-red-500", children: error }), !loading && !error && data.length > 0 && (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, margin: { top: 5, right: 20, left: -10, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false }), _jsx(XAxis, { dataKey: "date", fontSize: 12, tickLine: false, axisLine: false }), _jsx(YAxis, { fontSize: 12, tickLine: false, axisLine: false }), _jsx(Tooltip, { cursor: { fill: 'rgba(239, 246, 255, 0.5)' }, contentStyle: { fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e5e7eb' } }), _jsx(Bar, { dataKey: "value", fill: "#3b82f6", radius: [4, 4, 0, 0] })] }) }))] })] }));
}

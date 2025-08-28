// src/pages/admin/StatChartCard.tsx
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "@/components/Card";
import { api } from "@/lib/axios";

type ChartData = {
  date: string; // e.g., "08-23"
  value: number;
};


type Props = {
  title: string;
  endpoint: string;
};

export default function StatChartCard({ title, endpoint }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<any>(endpoint);

      // ✅ 응답 데이터가 숫자인지 확인하고 차트 형식에 맞게 변환
      if (typeof res.data === 'number') {
        // 소수점인 전환율(0.1)을 퍼센트(10%)로 변환
        const value = Math.round(res.data * 100);
        
        // recharts 라이브러리가 요구하는 배열 형태로 변환
        const chartData = [{ date: title.split(' ')[0], value: value }];
        setData(chartData);
      } else {
        // 숫자가 아닌 경우 에러 처리
        setError("데이터 형식이 올바르지 않습니다.");
        setData([]);
      }
    } catch (e: any) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return (
    <Card className="p-4 h-80 flex flex-col">
      <h3 className="font-bold">{title}</h3>
      <div className="flex-grow mt-4">
        {loading && <div className="flex items-center justify-center h-full text-gray-500">로딩 중...</div>}
        {error && <div className="flex items-center justify-center h-full text-red-500">{error}</div>}
        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
                contentStyle={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
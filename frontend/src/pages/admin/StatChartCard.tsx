// src/pages/admin/StatChartCard.tsx
import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import Card from "@/components/Card";
import { api, normalizeEndpoint } from "@/lib/axios";

type RawRow = {
  date: string; // "YYYY-MM-DD"
  sessions: number;
  totalSessions: number;
  signupSessions?: number;
  totalSignupSessions?: number;
  reachApplypageSessions?: number;
  totalReachApplypageSessions?: number;
  applyCompleteSessions?: number;
  totalApplyCompleteSessions?: number;
};

type ChartRow = {
  date: string; // "MM-DD"
  daily: number; // %
  cumulative: number; // %
};

type Props = {
  title: string;
  endpoint: string; // 반드시 "/stats/..." 형태 (앞 /api 금지)
};

const mmdd = (d: string) => (/^\d{4}-\d{2}-\d{2}$/.test(d) ? d.slice(5) : d);

function pickKeys(row: RawRow) {
  if ("signupSessions" in row || "totalSignupSessions" in row) {
    return { dailyKey: "signupSessions" as const, totalKey: "totalSignupSessions" as const };
  }
  if ("reachApplypageSessions" in row || "totalReachApplypageSessions" in row) {
    return { dailyKey: "reachApplypageSessions" as const, totalKey: "totalReachApplypageSessions" as const };
  }
  if ("applyCompleteSessions" in row || "totalApplyCompleteSessions" in row) {
    return { dailyKey: "applyCompleteSessions" as const, totalKey: "totalApplyCompleteSessions" as const };
  }
  return null;
}

export default function StatChartCard({ title, endpoint }: Props) {
  const [data, setData] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    // ✅ endpoint는 반드시 "/stats/..." 형태여야 함
    const ep = normalizeEndpoint(endpoint);

    // ✅ 토큰 보강
    const token = localStorage.getItem("token");

    const res = await api.get(ep, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (typeof res.data === "number") {
      const value = Math.round(res.data * 100);
      setData([
        { date: title.split(" ")[0] ?? "value", daily: value, cumulative: value },
      ]);
      return;
    }

    if (Array.isArray(res.data)) {
      const rows: RawRow[] = res.data;
      if (!rows.length) {
        setData([]);
        return;
      }

      const keys = pickKeys(rows[0]);
      if (!keys) {
        setError("데이터 키가 올바르지 않습니다.");
        setData([]);
        return;
      }

      const chartRows: ChartRow[] = rows.map((r) => {
        const dailyNum = (r as any)[keys.dailyKey] ?? 0;
        const dailyDen = r.sessions ?? 0;
        const cumNum = (r as any)[keys.totalKey] ?? 0;
        const cumDen = r.totalSessions ?? 0;

        const dailyPct =
          dailyDen > 0 ? Math.round((dailyNum / dailyDen) * 100) : 0;
        const cumulativePct =
          cumDen > 0 ? Math.round((cumNum / cumDen) * 100) : 0;

        return {
          date: mmdd(r.date),
          daily: dailyPct,
          cumulative: cumulativePct,
        };
      });

      setData(chartRows);
      return;
    }

    setError("데이터 형식이 올바르지 않습니다.");
    setData([]);
  } catch (e: any) {
    console.error(e);
    const msg =
      e?.response?.status === 401
        ? "인증 오류(401): 토큰 또는 관리자 권한을 확인하세요."
        : e?.response?.status === 404
        ? "엔드포인트가 존재하지 않습니다 (404). endpoint 값을 확인하세요."
        : e?.message || "데이터를 불러오는데 실패했습니다.";
    setError(msg);
    setData([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const hasData = useMemo(() => data.length > 0, [data]);

  return (
    <Card className="p-4 h-80 flex flex-col">
      <h3 className="font-bold">{title}</h3>
      <div className="flex-grow mt-4">
        {loading && <div className="flex items-center justify-center h-full text-gray-500">로딩 중...</div>}
        {error && <div className="flex items-center justify-center h-full text-red-500">{error}</div>}

        {!loading && !error && hasData && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                cursor={{ fill: "rgba(239, 246, 255, 0.5)" }}
                contentStyle={{ fontSize: "12px", padding: "4px 8px", borderRadius: "6px", border: "1px solid #e5e7eb" }}
                formatter={(value: any) => [`${value}%`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" verticalAlign="top" height={24} />
              <Bar dataKey="daily" name="일별 전환율" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cumulative" name="누적 전환율" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {!loading && !error && !hasData && (
          <div className="flex items-center justify-center h-full text-gray-400">표시할 데이터가 없습니다.</div>
        )}
      </div>
    </Card>
  );
}

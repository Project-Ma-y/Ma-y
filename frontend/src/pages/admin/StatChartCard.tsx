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
import { api } from "@/lib/axios";

type RawRow = {
  date: string; // "YYYY-MM-DD"
  sessions: number;
  totalSessions: number;
  // one of the below (endpoint별 상이)
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
  endpoint: string;
};

function mmdd(d: string) {
  // d: "YYYY-MM-DD" → "MM-DD"
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  return d.slice(5);
}

function pickKeys(row: RawRow) {
  if ("signupSessions" in row || "totalSignupSessions" in row) {
    return {
      dailyKey: "signupSessions" as const,
      totalKey: "totalSignupSessions" as const,
    };
  }
  if ("reachApplypageSessions" in row || "totalReachApplypageSessions" in row) {
    return {
      dailyKey: "reachApplypageSessions" as const,
      totalKey: "totalReachApplypageSessions" as const,
    };
  }
  if ("applyCompleteSessions" in row || "totalApplyCompleteSessions" in row) {
    return {
      dailyKey: "applyCompleteSessions" as const,
      totalKey: "totalApplyCompleteSessions" as const,
    };
  }
  // fallback (없으면 에러 처리)
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
      const res = await api.get(endpoint, { withCredentials: true });

      // ✅ 숫자 단일 응답 대비 (백엔드가 float만 주는 경우)
      if (typeof res.data === "number") {
        const value = Math.round(res.data * 100);
        setData([
          {
            date: title.split(" ")[0] ?? "value",
            daily: value,
            cumulative: value,
          },
        ]);
        return;
      }

      // ✅ 배열 응답 처리
      if (Array.isArray(res.data)) {
        const rows: RawRow[] = res.data;
        if (rows.length === 0) {
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
          const dailyNumerator = (r as any)[keys.dailyKey] ?? 0;
          const dailyDenominator = r.sessions ?? 0;
          const cumNumerator = (r as any)[keys.totalKey] ?? 0;
          const cumDenominator = r.totalSessions ?? 0;

          const dailyPct =
            dailyDenominator > 0
              ? Math.round((dailyNumerator / dailyDenominator) * 100)
              : 0;

          const cumulativePct =
            cumDenominator > 0
              ? Math.round((cumNumerator / cumDenominator) * 100)
              : 0;

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
    } catch (e) {
      console.error(e);
      setError("데이터를 불러오는데 실패했습니다.");
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
        {loading && (
          <div className="flex items-center justify-center h-full text-gray-500">
            로딩 중...
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        )}
        {!loading && !error && hasData && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip
                cursor={{ fill: "rgba(239, 246, 255, 0.5)" }}
                contentStyle={{
                  fontSize: "12px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                }}
                formatter={(value: any) => [`${value}%`, ""]}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                iconType="circle"
                verticalAlign="top"
                height={24}
              />
              {/* 일별 전환율 */}
              <Bar
                dataKey="daily"
                name="일별 전환율"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              {/* 누적 전환율 */}
              <Bar
                dataKey="cumulative"
                name="누적 전환율"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
        {!loading && !error && !hasData && (
          <div className="flex items-center justify-center h-full text-gray-400">
            표시할 데이터가 없습니다.
          </div>
        )}
      </div>
    </Card>
  );
}

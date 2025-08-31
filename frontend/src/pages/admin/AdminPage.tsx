// src/pages/admin/AdminPage.tsx
import { useMemo, useState } from "react";
import StatChartCard from "./StatChartCard";
import EndpointTable from "./EndpointTable";
import LogConsole from "./LogConsole";
import { ADMIN_ENDPOINTS } from "@/lib/adminEndpoints";
import { normalizeEndpoint } from "@/lib/axios";
import { api } from "@/lib/api"; // ✅ axios 인스턴스 사용

export default function AdminPage() {
  const [log, setLog] = useState<string>("");
  const [loadingEndpoint, setLoadingEndpoint] = useState<string | null>(null);

  // 엔드포인트 테스트
  const handleTestEndpoint = async (path: string) => {
    const ep = normalizeEndpoint(path);

    try {
      setLoadingEndpoint(ep);
      setLog(`[GET] ${ep}\n요청 중...`);

      // ✅ api 인스턴스로 요청 (자동으로 토큰 + 쿠키 붙음)
      const res = await api.get(ep, { withCredentials: true });

      const pretty =
        typeof res.data === "object"
          ? JSON.stringify(res.data, null, 2)
          : String(res.data);
      setLog(`[GET] ${ep}\n✅ 응답 성공:\n${pretty}`);
    } catch (e: any) {
      setLog(
        `[GET] ${ep}\n❌ 에러 발생:\n${
          e?.response?.data?.message ??
          e?.message ??
          "알 수 없는 에러"
        }`
      );
    } finally {
      setLoadingEndpoint(null);
    }
  };

  // 차트에 사용할 /stats/* 엔드포인트만 추출
  const STAT_ENDPOINTS = useMemo(
    () => ADMIN_ENDPOINTS.filter((e) => e.path.startsWith("/stats")),
    []
  );

  return (
    <div className="bg-gray-50 min-h-screen flex text-gray-800">
      {/* 사이드바 */}
      <aside className="w-64 bg-white p-6 border-r border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">Ma-y Admin</h1>
        <nav className="mt-8 space-y-1">
          <a
            href="/admin"
            className="block py-2 px-4 rounded bg-blue-50 text-blue-600 font-semibold"
          >
            대시보드
          </a>
          <a
            href="/admin/users"
            className="block py-2 px-4 rounded hover:bg-gray-50"
          >
            회원관리
          </a>
        </nav>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex items-center justify-between pb-6 border-b border-gray-200">
          <h2 className="text-3xl font-extrabold">대시보드</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border rounded-lg hover:bg-gray-100 transition"
          >
            새로고침
          </button>
        </header>

        {/* 통계 차트 그리드 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {STAT_ENDPOINTS.map((ep) => (
            <StatChartCard
              key={ep.name}
              title={ep.name}
              endpoint={normalizeEndpoint(ep.path)}
            />
          ))}
        </section>

        {/* API 테이블 및 로그 콘솔 */}
        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-8">
          <div className="xl:col-span-3">
            <EndpointTable
              onTest={handleTestEndpoint}
              loadingEndpoint={loadingEndpoint}
            />
          </div>
          <div className="xl:col-span-2">
            <LogConsole log={log} />
          </div>
        </section>
      </main>
    </div>
  );
}

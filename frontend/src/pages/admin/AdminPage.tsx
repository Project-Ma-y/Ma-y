// src/pages/admin/AdminPage.tsx
import { useState } from "react";
import { api } from "@/lib/axios";
import StatChartCard from "./StatChartCard";
import EndpointTable from "./EndpointTable";
import LogConsole from "./LogConsole";

export default function AdminPage() {
  const [log, setLog] = useState<string>("");
  const [loadingEndpoint, setLoadingEndpoint] = useState<string | null>(null);

  // 엔드포인트 테스트 함수
  const handleTestEndpoint = async (path: string) => {
    try {
      setLoadingEndpoint(path);
      setLog(`[GET] ${path} 요청 중...`);
      const res = await api.get(path);
      const responseData = typeof res.data === "object" ? JSON.stringify(res.data, null, 2) : String(res.data);
      setLog(`[GET] ${path}\n✅ 응답 성공:\n${responseData}`);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "알 수 없는 에러";
      setLog(`[GET] ${path}\n❌ 에러 발생:\n${msg}`);
    } finally {
      setLoadingEndpoint(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex text-gray-800">
      {/* 사이드바 (필요시 확장) */}
      <aside className="w-64 bg-white p-6 border-r border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">Ma-y Admin</h1>
        <nav className="mt-8">
          <a href="/admin" className="block py-2 px-4 rounded bg-blue-50 text-blue-600 font-semibold">
            대시보드
          </a>
          {/* 다른 메뉴 추가 가능 */}
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
          <StatChartCard title="회원가입 전환율" endpoint="/api/stats/signup-conversion" />
          <StatChartCard title="동행 신청 도달율" endpoint="/api/stats/application-reach" />
          <StatChartCard title="동행 신청 전환율" endpoint="/api/stats/application-conversion" />
        </section>

        {/* API 테이블 및 로그 콘솔 */}
        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-8">
          <div className="xl:col-span-3">
            <EndpointTable onTest={handleTestEndpoint} loadingEndpoint={loadingEndpoint} />
          </div>
          <div className="xl:col-span-2">
            <LogConsole log={log} />
          </div>
        </section>
      </main>
    </div>
  );
}
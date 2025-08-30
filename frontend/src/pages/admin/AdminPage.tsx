// src/pages/admin/AdminPage.tsx
import { useMemo, useState } from "react";
import StatChartCard from "./StatChartCard";
import EndpointTable from "./EndpointTable";
import LogConsole from "./LogConsole";
import { ADMIN_ENDPOINTS } from "@/lib/adminEndpoints";
import { getApiBaseURL, normalizeEndpoint } from "@/lib/axios";

/** HTML 테스트와 동일한 fetch 로직 (로컬스토리지 idToken, 쿠키 포함) */
async function request(base: string, endpoint: string, method = "GET") {
  const idToken = localStorage.getItem("idToken");
  const url = base.replace(/\/+$/, "") + normalizeEndpoint(endpoint);

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    credentials: "include",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = (isJson && (body as any)?.message) || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return body;
}

export default function AdminPage() {
  // axios 인스턴스의 현재 baseURL을 그대로 사용
  const [apiBase] = useState(() => getApiBaseURL());
  const [log, setLog] = useState<string>("");
  const [loadingEndpoint, setLoadingEndpoint] = useState<string | null>(null);

  // 엔드포인트 테스트 (HTML 예제와 동일)
  const handleTestEndpoint = async (path: string) => {
    const ep = normalizeEndpoint(path);

    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      setLog("⚠️ idToken이 없습니다. 먼저 로그인하세요.");
      return;
    }

    try {
      setLoadingEndpoint(ep);
      setLog(`[GET] ${ep} @ ${apiBase}\n요청 중...`);
      const data = await request(apiBase, ep, "GET");
      const pretty = typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);
      setLog(`[GET] ${ep}\n✅ 응답 성공:\n${pretty}`);
    } catch (e: any) {
      setLog(`[GET] ${ep}\n❌ 에러 발생:\n${e?.message ?? "알 수 없는 에러"}`);
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
        <nav className="mt-8">
          <a
            href="/admin"
            className="block py-2 px-4 rounded bg-blue-50 text-blue-600 font-semibold"
          >
            대시보드
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
              endpoint={normalizeEndpoint(ep.path)} // /api 중복 방지
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

// src/pages/admin/AdminPage.tsx
import { useMemo, useState } from "react";
import StatChartCard from "./StatChartCard";
import EndpointTable from "./EndpointTable";
import LogConsole from "./LogConsole";
import { ADMIN_ENDPOINTS } from "@/lib/adminEndpoints";
import { getApiBaseURL, setApiBaseURL, useFallbackBaseURL } from "@/lib/axios";

// 동일: /api 중복 제거 + 선행 슬래시 보장
const normalizeEndpoint = (ep: string) => {
  let s = ep.trim();
  if (/^https?:\/\//i.test(s)) return s;
  s = s.replace(/^\/?api\/?/i, "");
  if (!s.startsWith("/")) s = "/" + s;
  return s;
};

// HTML 테스트와 동일 fetch
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
  const [log, setLog] = useState("");
  const [loadingEndpoint, setLoadingEndpoint] = useState<string | null>(null);

  // 현재 axios의 baseURL을 그대로 사용 (한 곳에서 관리)
  const [base, setBase] = useState(() => getApiBaseURL());

  const STAT_ENDPOINTS = useMemo(
    () => ADMIN_ENDPOINTS.filter((e) => e.path.startsWith("/stats")),
    []
  );

  const handleChangeBase = () => {
    const next = prompt("새 API Base URL을 입력하세요", base) || base;
    setApiBaseURL(next);
    const applied = getApiBaseURL();
    setBase(applied);
    setLog(`🔧 API Base URL 변경: ${applied}`);
  };

  const handleUseFallback = () => {
    const applied = useFallbackBaseURL(0);
    setBase(applied);
    setLog(`🔁 Fallback Base URL 적용: ${applied}`);
  };

  // HTML 예제와 동일 로직의 엔드포인트 테스트
  const handleTestEndpoint = async (path: string) => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      setLog("⚠️ idToken이 없습니다. 먼저 로그인하세요.");
      return;
    }
    const ep = normalizeEndpoint(path);
    try {
      setLoadingEndpoint(ep);
      setLog(`[GET] ${ep} @ ${base}\n요청 중...`);
      const data = await request(base, ep, "GET");
      const pretty = typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);
      setLog(`[GET] ${ep}\n✅ 응답 성공:\n${pretty}`);
    } catch (e: any) {
      setLog(`[GET] ${ep}\n❌ 에러 발생:\n${e?.message ?? "알 수 없는 에러"}`);
    } finally {
      setLoadingEndpoint(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex text-gray-800">
      {/* 사이드바 */}
      <aside className="w-72 bg-white p-6 border-r border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">Ma-y Admin</h1>

        <div className="mt-6 space-y-2 text-xs text-gray-600 break-all">
          <div className="font-semibold">API Base URL</div>
          <div className="p-2 bg-gray-50 rounded border">{base}</div>
          <div className="flex gap-2">
            <button
              onClick={handleChangeBase}
              className="px-3 py-1 rounded border text-sm hover:bg-gray-100"
            >
              변경
            </button>
            <button
              onClick={handleUseFallback}
              className="px-3 py-1 rounded border text-sm hover:bg-gray-100"
            >
              Fallback 적용
            </button>
          </div>
          <p className="text-[11px] text-gray-500">
            DNS 에러 시 Render Fallback으로 전환하세요.
          </p>
        </div>

        <nav className="mt-8">
          <a href="/admin" className="block py-2 px-4 rounded bg-blue-50 text-blue-600 font-semibold">
            대시보드
          </a>
        </nav>
      </aside>

      {/* 메인 */}
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

        {/* 통계 차트 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {STAT_ENDPOINTS.map((ep) => (
            <StatChartCard
              key={ep.name}
              title={ep.name}
              endpoint={ep.path} // 내부 normalize가 처리 (/api 중복 X)
            />
          ))}
        </section>

        {/* API 테이블 & 로그 */}
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

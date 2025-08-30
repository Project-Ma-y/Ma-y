// src/pages/admin/AdminPage.tsx
import { useState } from "react";
import StatChartCard from "./StatChartCard";
import EndpointTable from "./EndpointTable";
import LogConsole from "./LogConsole";
import { ADMIN_ENDPOINTS } from "@/lib/adminEndpoints";

/** 동일 로직: HTML 테스트 페이지와 같은 방식으로 동작하도록 fetch 기반 유틸 */
const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string) ??
  // HTML 예제는 Render URL을 사용했지만, 배포는 아래 도메인을 기본값으로 둡니다.
  "https://api.mayservice.co.kr/api";

/** /api 중복 방지 + 선행 슬래시 보장 */
const normalizeEndpoint = (ep: string) => {
  let s = ep.trim();
  if (/^https?:\/\//i.test(s)) return s; // 풀 URL은 그대로 사용
  s = s.replace(/^\/?api\/?/i, ""); // 앞쪽 /api 제거
  if (!s.startsWith("/")) s = `/${s}`;
  return s;
};

/** HTML 테스트와 동일한 fetch 로직 (로컬스토리지 idToken 사용, 쿠키 항상 포함) */
async function request(endpoint: string, method: string = "GET") {
  const idToken = localStorage.getItem("idToken");
  const url = `${API_BASE}${normalizeEndpoint(endpoint)}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    credentials: "include",
  });

  // 204 등 비본문 응답 처리
  const isJson =
    res.headers.get("content-type")?.includes("application/json") ?? false;
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg =
      (isJson && (body as any)?.message) ||
      `${res.status} ${res.statusText}` ||
      "요청 실패";
    throw new Error(msg);
  }
  return body;
}

export default function AdminPage() {
  const [log, setLog] = useState<string>("");
  const [loadingEndpoint, setLoadingEndpoint] = useState<string | null>(null);

  // 엔드포인트 테스트 함수 (HTML 예제와 동일 로직)
  const handleTestEndpoint = async (path: string) => {
    const ep = normalizeEndpoint(path);

    // idToken 존재 안내 (HTML 예제의 문구와 동일한 의미)
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      setLog("⚠️ idToken이 없습니다. 먼저 로그인하세요.");
      return;
    }

    try {
      setLoadingEndpoint(ep);
      setLog(`[GET] ${ep} 요청 중...`);
      const data = await request(ep, "GET");
      const pretty =
        typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);
      setLog(`[GET] ${ep}\n✅ 응답 성공:\n${pretty}`);
    } catch (e: any) {
      setLog(`[GET] ${ep}\n❌ 에러 발생:\n${e?.message ?? "알 수 없는 에러"}`);
    } finally {
      setLoadingEndpoint(null);
    }
  };

  // 차트에 사용할 /stats/* 엔드포인트만 추출
  const STAT_ENDPOINTS = ADMIN_ENDPOINTS.filter((e) =>
    e.path.startsWith("/stats")
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
              // 차트 쪽에서도 /api 중복 방지 위해 normalize
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

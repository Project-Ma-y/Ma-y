// src/pages/admin/AdminUsersPage.tsx
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Card from "@/components/Card";
import { normalizeEndpoint } from "@/lib/axios";

type UserRow = {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  createdAt?: string;
  isDeleted?: boolean;
};

export default function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [log, setLog] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setLog("불러오는 중…");
    try {
      const ep = normalizeEndpoint("/users/");
      const token = localStorage.getItem("token");
      const res = await api.get<UserRow[]>(ep, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setRows(res.data ?? []);
      setLog(`총 ${res.data?.length ?? 0}명`);
    } catch (e: any) {
      setLog(e?.response?.data?.message ?? e?.message ?? "불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (uid: string) => {
  if (!confirm("정말 이 회원을 삭제하시겠어요?")) return;

  try {
    const ep = normalizeEndpoint("/users");
    const res = await api.delete(ep, {
      // 헤더 + 쿠키 포함은 인스턴스 기본값으로 충족됨(위 interceptors 참고)
      params: { uid }, // ← 스펙: params에 uid 필요
    });

    // 200 { message: "회원 삭제 성공" }
    if (res.status === 200) {
      setRows((prev) => prev.filter((r) => r.id !== uid));
      return;
    }

    alert(res?.data?.message ?? "삭제 실패");
  } catch (e: any) {
    // 400/500 { message: "유저 삭제 실패" }
    const msg = e?.response?.data?.message ?? e?.message ?? "삭제 실패";
    alert(msg);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter((r) =>
      [r.id, r.email, r.name, r.phone]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(qq))
    );
  }, [rows, q]);

  return (
    <div className="bg-gray-50 min-h-screen flex text-gray-800">
      <aside className="w-64 bg-white p-6 border-r border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">Ma-y Admin</h1>
        <nav className="mt-8 space-y-1">
          <a href="/admin" className="block py-2 px-4 rounded hover:bg-gray-50">
            대시보드
          </a>
          <a
            href="/admin/users"
            className="block py-2 px-4 rounded bg-blue-50 text-blue-600 font-semibold"
          >
            회원관리
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex items-center justify-between pb-6 border-b border-gray-200">
          <h2 className="text-3xl font-extrabold">회원관리</h2>
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="이름/이메일/전화/ID 검색"
              className="px-3 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchUsers}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border rounded-lg hover:bg-gray-100 transition"
            >
              새로고침
            </button>
          </div>
        </header>

        <div className="mt-6 grid gap-6">
          <Card className="p-0 overflow-hidden">
            <div className="px-4 py-3 border-b text-sm text-gray-500">{log}</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">이메일</th>
                    <th className="px-4 py-3">이름</th>
                    <th className="px-4 py-3">전화번호</th>
                    <th className="px-4 py-3">가입일</th>
                    <th className="px-4 py-3 text-right">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td className="px-4 py-10 text-center text-gray-400" colSpan={6}>
                        표시할 회원이 없습니다.
                      </td>
                    </tr>
                  )}
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{u.id}</td>
                      <td className="px-4 py-3">{u.email ?? "-"}</td>
                      <td className="px-4 py-3">{u.name ?? "-"}</td>
                      <td className="px-4 py-3">{u.phone ?? "-"}</td>
                      <td className="px-4 py-3">
                        {u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => removeUser(u.id)}
                          className="px-3 py-1 rounded-lg border text-red-600 hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

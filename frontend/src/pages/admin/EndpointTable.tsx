// src/pages/admin/EndpointTable.tsx
import Button from "@/components/button/Button";
import Card from "@/components/Card";
import { ADMIN_ENDPOINTS } from "@/lib/adminEndpoints";

type Props = {
  onTest: (path: string) => void;
  loadingEndpoint: string | null;
}

export default function EndpointTable({ onTest, loadingEndpoint }: Props) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-4 py-3 text-lg font-bold border-b">API Endpoints</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">기능</th>
              <th className="px-4 py-2 text-left font-semibold">HTTP</th>
              <th className="px-4 py-2 text-left font-semibold">API Path</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {ADMIN_ENDPOINTS.map((e) => (
              <tr key={e.name} className="border-t">
                <td className="px-4 py-3">{e.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded-md border bg-gray-100 px-2 py-0.5 text-xs font-bold">{e.method}</span>
                </td>
                <td className="px-4 py-3 font-mono">{e.path}</td>
                <td className="px-4 py-3 text-right">
                  {e.method === "GET" && (
                    <Button
                      type="secondary"
                      buttonName={loadingEndpoint === e.path ? "테스트 중..." : "테스트"}
                      onClick={() => onTest(e.path)}
                      disabled={loadingEndpoint !== null}
                      className="h-8 px-3 text-xs"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
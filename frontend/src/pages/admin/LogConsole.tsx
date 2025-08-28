// src/pages/admin/LogConsole.tsx
import Card from "@/components/Card";

type Props = {
  log: string;
}

export default function LogConsole({ log }: Props) {
  return (
    <Card className="h-full">
      <div className="text-sm font-semibold">Response Log</div>
      <pre className="mt-2 h-full min-h-[200px] overflow-auto rounded-lg bg-gray-900 text-white p-3 text-xs font-mono">
        {log || "API 테스트 결과가 여기에 표시됩니다."}
      </pre>
    </Card>
  );
}
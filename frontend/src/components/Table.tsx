import { ReactNode } from 'react'

type Col<T> = { key: keyof T; header: ReactNode; render?: (v: T[keyof T], row: T) => ReactNode }
type Props<T> = { columns: Col<T>[]; data: T[] }

export function Table<T extends Record<string, any>>({ columns, data }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold text-gray-700">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, r) => (
            <tr key={r} className="border-t">
              {columns.map((c, i) => (
                <td key={i} className="px-4 py-3">{c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

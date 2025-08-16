import { Button } from './Button'

type Props = { page: number; pageSize: number; total: number; onChange: (p: number) => void }

export function Pagination({ page, pageSize, total, onChange }: Props) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const prev = () => onChange(Math.max(1, page - 1))
  const next = () => onChange(Math.min(pageCount, page + 1))
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-sm text-gray-600">Page {page} / {pageCount}</div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={prev} disabled={page <= 1}>Prev</Button>
        <Button variant="secondary" onClick={next} disabled={page >= pageCount}>Next</Button>
      </div>
    </div>
  )
}

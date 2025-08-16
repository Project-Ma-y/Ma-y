import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'

type User = { id: string; name: string; email: string; createdAt: string }

export function Users() {
  const [q, setQ] = useState('')
  const [data, setData] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 10
  const total = 100

  useEffect(() => {
    api.get('/users', { params: { q, page, pageSize } }).then((r) => setData(r.data?.items ?? []))
  }, [q, page])

  return (
    <>
      <PageHeader
        title="회원"
        actions={
          <div className="flex gap-2">
            <Input placeholder="검색" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
            <Button variant="secondary" onClick={() => setQ('')}>초기화</Button>
          </div>
        }
      />
      <Card>
        <Table<User>
          columns={[
            { key: 'name', header: '이름' },
            { key: 'email', header: '이메일' },
            { key: 'createdAt', header: '가입일' },
          ]}
          data={data}
        />
        <div className="mt-4">
          <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
        </div>
      </Card>
    </>
  )
}

import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'

export function Dashboard() {
  return (
    <>
      <PageHeader title="대시보드" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>위젯</Card>
        <Card>위젯</Card>
        <Card>위젯</Card>
      </div>
    </>
  )
}

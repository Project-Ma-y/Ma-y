import { ReactNode } from 'react'

export function PageHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-xl font-bold">{title}</h1>
      {actions}
    </div>
  )
}
export default PageHeader;
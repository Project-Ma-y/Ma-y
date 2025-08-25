type Props = { title: string; description?: string; action?: React.ReactNode }

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-10 text-center">
      <div className="text-base font-semibold">{title}</div>
      {description && <div className="mt-1 text-sm text-gray-600">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

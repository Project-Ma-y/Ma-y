import { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useUIStore } from '@/store/uiStore'

type Props = { id: string; title?: string; children: ReactNode; footer?: ReactNode }

export function Modal({ id, title, children, footer }: Props) {
  const isOpen = useUIStore((s) => s.isModalOpen(id))
  const close = useUIStore((s) => s.closeModal)
  if (!isOpen) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => close(id)} />
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        {title && <h3 className="mb-4 text-lg font-semibold">{title}</h3>}
        <div>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

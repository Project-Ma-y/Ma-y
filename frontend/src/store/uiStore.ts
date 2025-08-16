import { create } from 'zustand'

type Toast = { id: string; title?: string; message: string; duration?: number }
type ModalState = { id: string; isOpen: boolean; payload?: unknown }

type UIState = {
  toasts: Toast[]
  modals: Record<string, ModalState>
  pushToast: (t: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  openModal: (id: string, payload?: unknown) => void
  closeModal: (id: string) => void
  isModalOpen: (id: string) => boolean
  getModalPayload: (id: string) => unknown
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  modals: {},
  pushToast: (t) => {
    const id = crypto.randomUUID()
    const toast = { id, duration: 2500, ...t }
    set((s) => ({ toasts: [...s.toasts, toast] }))
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => get().removeToast(id), toast.duration)
    }
    return id
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
  openModal: (id, payload) =>
    set((s) => ({ modals: { ...s.modals, [id]: { id, isOpen: true, payload } } })),
  closeModal: (id) =>
    set((s) => ({ modals: { ...s.modals, [id]: { id, isOpen: false } } })),
  isModalOpen: (id) => !!get().modals[id]?.isOpen,
  getModalPayload: (id) => get().modals[id]?.payload,
}))

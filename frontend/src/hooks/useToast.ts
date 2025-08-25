import { useUIStore } from '@/store/uiStore'

export function useToast() {
  const push = useUIStore((s) => s.pushToast)
  return {
    success: (message: string, title?: string) => push({ message, title }),
    error: (message: string, title?: string) => push({ message, title }),
    info: (message: string, title?: string) => push({ message, title }),
  }
}

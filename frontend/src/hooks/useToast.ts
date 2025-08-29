import { useUIStore } from "@/store/uiStore";

export const useToast = () => {
  const push = useUIStore((s: any) => s?.pushToast || s?.showToast || s?.toast);

  return {
    show: (msg: string) => push?.({ message: msg }),
  };
};
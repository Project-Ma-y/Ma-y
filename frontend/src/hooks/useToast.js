import { useUIStore } from "@/store/uiStore";
export const useToast = () => {
    const push = useUIStore((s) => s?.pushToast || s?.showToast || s?.toast);
    return {
        show: (msg) => push?.({ message: msg }),
    };
};

// src/store/uiStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  // 기존 모달 상태들...
  modals: Record<string, boolean>;

  // ✅ 글자 확대
  largeTextEnabled: boolean;
};

type UIActions = {
  // 기존 모달 액션들...
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  isModalOpen: (id: string) => boolean;

  // ✅ 글자 확대 토글
  toggleLargeText: (enabled?: boolean) => void;
};

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      // ---- existing ----
      modals: {},
      openModal: (id) => set((s) => ({ modals: { ...s.modals, [id]: true } })),
      closeModal: (id) =>
        set((s) => {
          const next = { ...s.modals };
          delete next[id];
          return { modals: next };
        }),
      isModalOpen: (id) => !!get().modals[id],

      // ✅ 글자 확대 (로컬스토리지에 유지)
      largeTextEnabled: false,
      toggleLargeText: (enabled) =>
        set((s) => ({
          largeTextEnabled: typeof enabled === "boolean" ? enabled : !s.largeTextEnabled,
        })),
    }),
    { name: "ui-prefs" }
  )
);

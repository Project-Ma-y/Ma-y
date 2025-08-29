// src/store/uiStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useUIStore = create()(persist((set, get) => ({
    // ---- existing ----
    modals: {},
    openModal: (id) => set((s) => ({ modals: { ...s.modals, [id]: true } })),
    closeModal: (id) => set((s) => {
        const next = { ...s.modals };
        delete next[id];
        return { modals: next };
    }),
    isModalOpen: (id) => !!get().modals[id],
    // ✅ 글자 확대 (로컬스토리지에 유지)
    largeTextEnabled: false,
    toggleLargeText: (enabled) => set((s) => ({
        largeTextEnabled: typeof enabled === "boolean" ? enabled : !s.largeTextEnabled,
    })),
}), { name: "ui-prefs" }));

import { create } from "zustand";

type TermsModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useTermsModal = create<TermsModalStore>(set => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
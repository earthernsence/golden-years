import { create } from "zustand";

type PrivacyPolicyModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const usePrivacyPolicyModal = create<PrivacyPolicyModalStore>(set => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
import { create } from "zustand";

type TeamInfoModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useTeamInfoModal = create<TeamInfoModalStore>(set => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
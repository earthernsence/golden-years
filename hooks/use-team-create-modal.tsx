import { create } from "zustand";

type TeamCreateModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useTeamCreateModal = create<TeamCreateModalStore>(set => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));
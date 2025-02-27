import { create } from "zustand";

type NewsroomInfoModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewsroomInfoModal = create<NewsroomInfoModalStore>(set => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
import { create } from "zustand";

type UploadProfilePictureModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onReplace: (url: string) => void;
  url?: string;
}

export const useUploadProfilePictureModal = create<UploadProfilePictureModalStore>(set => ({
  url: undefined,
  isOpen: false,
  onOpen: () => set({ isOpen: true, url: undefined }),
  onClose: () => set({ isOpen: false, url: undefined }),
  onReplace: (url: string) => set({ isOpen: true, url })
}));
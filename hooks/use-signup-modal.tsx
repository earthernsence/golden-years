import { create } from "zustand";

interface Event {
  eventId: string,
  title: string,
  date: number,
  description: string,
  image?: string,
  location: string,
  organiser: {
    name: string,
    email: string,
    username: string
  }
}

type SignupModalStore = {
  isOpen: boolean;
  event?: Event;
  // eslint-disable-next-line no-unused-vars
  onOpen: (event?: Event) => void;
  onClose: () => void;
}

export const useSignupModal = create<SignupModalStore>(set => ({
  isOpen: false,
  event: undefined,
  onOpen: (event?: Event) => set({ isOpen: true, event }),
  onClose: () => set({ isOpen: false, event: undefined })
}));
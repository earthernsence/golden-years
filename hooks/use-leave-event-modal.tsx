import { create } from "zustand";

interface Event {
  eventId: string,
  title: string,
  date: number,
  description: string,
  image?: string,
  location: string,
  slots: number,
  participants: Array<string>,
  organiser: string,
}

type LeaveEventModalStore = {
  isOpen: boolean;
  event?: Event;
  // eslint-disable-next-line no-unused-vars
  onOpen: (event?: Event) => void;
  onClose: () => void;
}

export const useLeaveModal = create<LeaveEventModalStore>(set => ({
  isOpen: false,
  event: undefined,
  onOpen: (event?: Event) => set({ isOpen: true, event }),
  onClose: () => set({ isOpen: false, event: undefined })
}));
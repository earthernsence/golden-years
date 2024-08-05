import { create } from "zustand";

import { Id } from "@/convex/_generated/dataModel";

interface Event {
  eventId: string,
  title: string,
  date: number,
  endDate?: number,
  description: string,
  image?: string,
  location: string,
  slots: number,
  participants: Array<string>,
  organiser: string,
  _id: Id<"events">
}

type EditEventModalStore = {
  isOpen: boolean;
  event?: Event;
  // eslint-disable-next-line no-unused-vars
  onOpen: (event: Event) => void;
  onClose: () => void;
};

export const useEditEventModal = create<EditEventModalStore>(set => ({
  isOpen: false,
  event: undefined,
  onOpen: (event: Event) => set({ isOpen: true, event }),
  onClose: () => set({ isOpen: false })
}));
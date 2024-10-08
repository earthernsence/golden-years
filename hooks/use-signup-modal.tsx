import { create } from "zustand";

import { Id } from "@/convex/_generated/dataModel";

interface Event {
  _id: Id<"events">,
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
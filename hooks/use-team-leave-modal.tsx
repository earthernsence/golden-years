import { create } from "zustand";

import { Doc } from "@/convex/_generated/dataModel";

type TeamLeaveModalStore = {
  isOpen: boolean;
  team?: Partial<Doc<"teams">>;
  // eslint-disable-next-line no-unused-vars
  onOpen: (team?: Partial<Doc<"teams">>) => void;
  onClose: () => void;
};

export const useTeamLeaveModal = create<TeamLeaveModalStore>(set => ({
  isOpen: false,
  team: undefined,
  onOpen: (team?: Partial<Doc<"teams">>) => set({ isOpen: true, team }),
  onClose: () => set({ isOpen: false, team: undefined }),
}));
import { create } from "zustand";

import { Doc } from "@/convex/_generated/dataModel";

type TeamMembersModalStore = {
  isOpen: boolean;
  team?: Partial<Doc<"teams">>;
  // eslint-disable-next-line no-unused-vars
  onOpen: (team?: Partial<Doc<"teams">>) => void;
  onClose: () => void;
};

export const useTeamMembersModal = create<TeamMembersModalStore>(set => ({
  isOpen: false,
  team: undefined,
  onOpen: (team?: Partial<Doc<"teams">>) => set({ isOpen: true, team }),
  onClose: () => set({ isOpen: false, team: undefined }),
}));
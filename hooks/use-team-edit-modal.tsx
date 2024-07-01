import { create } from "zustand";

import { Doc } from "@/convex/_generated/dataModel";

type TeamEditModalStore = {
  isOpen: boolean;
  team?: Doc<"teams">;
  // eslint-disable-next-line no-unused-vars
  onOpen: (team?: Doc<"teams">) => void;
  onClose: () => void;
};

export const useTeamEditModal = create<TeamEditModalStore>(set => ({
  isOpen: false,
  team: undefined,
  onOpen: (team?: Doc<"teams">) => set({ isOpen: true, team }),
  onClose: () => set({ isOpen: false, team: undefined }),
}));
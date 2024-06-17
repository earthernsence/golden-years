import { create } from "zustand";

interface User {
  userId: string,
  name: string,
  email: string,
  username: string,
  signupTime: number,
  admin: Boolean,
  exec?: string,
  bio?: string,
  location?: string,
  image?: string,
  groups: Array<string>,
  events: Array<string>
}

type AssignRoleModalStore = {
  isOpen: boolean;
  user?: User,
  // eslint-disable-next-line no-unused-vars
  onOpen: (user?: User) => void;
  onClose: () => void;
}

export const useAssignRoleModal = create<AssignRoleModalStore>(set => ({
  isOpen: false,
  user: undefined,
  onOpen: (user?: User) => set({ isOpen: true, user }),
  onClose: () => set({ isOpen: false, user: undefined })
}));
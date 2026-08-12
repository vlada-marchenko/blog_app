import { create } from "zustand";
import type { User } from "firebase/auth";

interface Blog {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isOpenModal: boolean;
  mode: "login" | "register";
  open: (mode: "login" | "register") => void;
  close: () => void;
}

export const useBlogStore = create<Blog>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  user: null,
  setUser: (user) => set({ user }),
  isOpenModal: false,
  mode: "login",
  open: (mode) => set({ isOpenModal: true, mode }),
  close: () => set({ isOpenModal: false }),
}));

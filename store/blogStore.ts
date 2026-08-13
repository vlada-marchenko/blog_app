import { create } from "zustand";
import type { User } from "firebase/auth";

interface Blog {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isOpenAuthModal: boolean;
  mode: "login" | "register";
  open: (mode: "login" | "register") => void;
  close: () => void;
  selectedId: string | null;
  setSelectedId: (selectedId: string | null) => void;
  isOpenModal: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useBlogStore = create<Blog>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  user: null,
  setUser: (user) => set({ user }),
  isOpenAuthModal: false,
  mode: "login",
  open: (mode) => set({ isOpenAuthModal: true, mode }),
  close: () => set({ isOpenAuthModal: false }),
  selectedId: null,
  setSelectedId: (selectedId) => set({ selectedId }),
  isOpenModal: false,
  openModal: () => set({ isOpenModal: true }),
  closeModal: () => set({ isOpenModal: false }),
}));

import { create } from "zustand";
import type { User } from "firebase/auth";

type ModalName = "auth" | "post" | "edit";

interface Blog {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  activeModal: ModalName | null;
  mode: "login" | "register";
  openModal: (modal: ModalName, mode?: "login" | "register") => void;
  closeModal: () => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  tag: string | null;
  setTag: (tag: string | null) => void;
}

export const useBlogStore = create<Blog>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  user: null,
  setUser: (user) => set({ user }),
  activeModal: null,
  mode: "login",
  openModal: (modal, mode) =>
    set({ activeModal: modal, ...(mode ? { mode } : {}) }),
  closeModal: () => set({ activeModal: null }),
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  tag: null,
  setTag: (tag) => set({ tag }),
}));

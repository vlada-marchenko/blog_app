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
  isOpenEditModal: boolean;
  openEditModal: () => void;
  closeEditModal: () => void;
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
  isOpenAuthModal: false,
  mode: "login",
  open: (mode) => set({ isOpenAuthModal: true, mode }),
  close: () => set({ isOpenAuthModal: false }),
  selectedId: null,
  setSelectedId: (selectedId) => set({ selectedId }),
  isOpenModal: false,
  openModal: () => set({ isOpenModal: true }),
  closeModal: () => set({ isOpenModal: false }),
  isOpenEditModal: false,
  openEditModal: () => set({ isOpenEditModal: true }),
  closeEditModal: () => set({ isOpenEditModal: false }),
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  tag: null,
  setTag: (tag) => set({ tag }),
}));

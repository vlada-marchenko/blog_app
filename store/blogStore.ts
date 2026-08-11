import { create } from "zustand";

interface Loading {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const useLoadingStore = create<Loading>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));

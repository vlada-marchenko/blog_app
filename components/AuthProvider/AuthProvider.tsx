"use client";

import { useEffect } from "react";
import { auth } from "../../lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { useBlogStore } from "@/store/blogStore";

export function AuthProvider() {
  const setUser = useBlogStore((state) => state.setUser);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [setUser]);

  return null;
}

export function useAuth() {
  const user = useBlogStore((state) => state.user);
  return user;
}

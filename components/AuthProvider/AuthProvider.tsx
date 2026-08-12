import { createContext, useContext, useEffect } from "react";
import { auth } from "../../lib/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { useBlogStore } from "@/store/blogStore";

type AuthproviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<User | null>(null);

export function AuthProvider({ children }: AuthproviderProps) {
  const user = useBlogStore((state) => state.user);
  const setUser = useBlogStore((state) => state.setUser);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [setUser]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

"use client";

import css from "./Header.module.css";
import { useBlogStore } from "@/store/blogStore";
import AuthModal from "../AuthModal/AuthModal";
import { useAuth } from "../AuthProvider/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function Header() {
  const user = useAuth();
  const openModal = useBlogStore((state) => state.open);

  async function handleLogout() {
    await signOut(auth);
    await fetch("/api/auth/session", { method: "DELETE" });
  }

  return (
    <section className={css.header}>
      <span className={css.icon}>Blog.</span>

      {!user ? (
        <div className={css.actionButtons}>
          <div className={css.authButtons}>
            <button
              className={css.login}
              type="button"
              onClick={() => openModal("login")}
            >
              Log in
            </button>
            <button
              className={css.register}
              type="button"
              onClick={() => openModal("register")}
            >
              Register
            </button>
          </div>
          <button className={css.createPost} type="button">
            +New Post
          </button>
        </div>
      ) : (
        <div className={css.userCont}>
          <span className={css.userHi}>Hi, {user.displayName}</span>
          <button className={css.logout} onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
      <AuthModal />
    </section>
  );
}

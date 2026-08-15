"use client";

import css from "./Header.module.css";
import { useBlogStore } from "@/store/blogStore";
import AuthModal from "../AuthModal/AuthModal";
import PostModal from "../PostModal/PostModal";
import { useAuth } from "../AuthProvider/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { toast } from "sonner";
import { usePosts } from "@/hooks/usePosts";

export default function Header() {
  const user = useAuth();
  const openAuthModal = useBlogStore((state) => state.open);
  const openModal = useBlogStore((state) => state.openModal);
  const setSelectedId = useBlogStore((state) => state.setSelectedId);
  const setSearchQuery = useBlogStore((state) => state.setSearchQuery);
  const setTag = useBlogStore((state) => state.setTag);
  const { mutate } = usePosts();

  function handleGoHome() {
    setSelectedId(null);
    setSearchQuery("");
    setTag(null);
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      await fetch("/api/auth/session", { method: "DELETE" });
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }

  return (
    <section className={css.header}>
      <button
        type="button"
        className={css.icon}
        onClick={handleGoHome}
      >
        Blog.
      </button>

      {!user ? (
        <div className={css.actionButtons}>
          <div className={css.authButtons}>
            <button
              className={css.login}
              type="button"
              onClick={() => openAuthModal("login")}
            >
              Log in
            </button>
            <button
              className={css.register}
              type="button"
              onClick={() => openAuthModal("register")}
            >
              Register
            </button>
          </div>
        </div>
      ) : (
        <div className={css.userCont}>
          <span className={css.userHi}>Hi, {user.displayName}</span>
          <button className={css.logout} onClick={handleLogout}>
            Log out
          </button>
          <button
            type="button"
            onClick={() => openModal()}
            className={css.createPost}
          >
            +New Post
          </button>
        </div>
      )}
      <AuthModal />
      <PostModal onPosted={mutate} />
    </section>
  );
}

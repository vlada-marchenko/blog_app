"use client";

import css from "./PostModal.module.css";
import { useForm } from "react-hook-form";
import { useBlogStore } from "@/store/blogStore";
import Loader from "../Loader/Loader";
import { createPortal } from "react-dom";

type PostModalValues = {
  title: string;
  excerpt: string;
  content: string;
  tags: string;
};

type PostModalProps = {
  onPosted?: () => void;
};

export default function PostModal({ onPosted }: PostModalProps) {
  const { register, handleSubmit, reset } = useForm<PostModalValues>();
  const isLoading = useBlogStore((state) => state.isLoading);
  const setLoading = useBlogStore((state) => state.setLoading);
  const closeModal = useBlogStore((state) => state.closeModal);
  const isOpenModal = useBlogStore((state) => state.isOpenModal);

  if (!isOpenModal) return null;

  const handlePost = async ({
    title,
    excerpt,
    content,
    tags,
  }: PostModalValues) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        onPosted?.();
        reset();
        closeModal();
      }
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return createPortal(
    <div onClick={closeModal} className={css.overlay}>
      <div onClick={(e) => e.stopPropagation()} className={css.modal}>
        <button
          type="button"
          className={css.closeButton}
          onClick={closeModal}
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <h3 className={css.title}>Create new post</h3>
        <form onSubmit={handleSubmit(handlePost)} className={css.form}>
          <input
            type="text"
            {...register("tags")}
            placeholder="Add a tags, separated with ','"
            className={`${css.input} ${css.tags}`}
          />
          <input
            type="text"
            {...register("title")}
            placeholder="Add a title"
            className={`${css.input} ${css.titleInput}`}
          />
          <textarea
            {...register("excerpt")}
            placeholder="Add a short decription"
            className={css.input}
          />
          <textarea
            {...register("content")}
            placeholder="Type what is on your mind"
            className={`${css.input} ${css.content}`}
          />
          <button type="submit" className={css.button}>
            Create a post
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}

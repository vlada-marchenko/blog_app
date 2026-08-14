"use client";

import css from "./EditModal.module.css";
import { useBlogStore } from "@/store/blogStore";
import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import Loader from "@/components/Loader/Loader";
import { Post } from "@/types/post";
import { toast } from "sonner";

type EditModalValues = {
  title: string;
  excerpt: string;
  content: string;
  tags: string;
};

type EditModalProps = {
  post: Post;
  onEdit?: () => void;
};

export default function EditModal({ onEdit, post }: EditModalProps) {
  const { register, handleSubmit, reset } = useForm<EditModalValues>({
    defaultValues: {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(","),
    },
  });
  const isLoading = useBlogStore((state) => state.isLoading);
  const setLoading = useBlogStore((state) => state.setLoading);
  const closeEditModal = useBlogStore((state) => state.closeEditModal);
  const isOpenEditModal = useBlogStore((state) => state.isOpenEditModal);

  if (!isOpenEditModal) return null;

  const handleEdit = async ({
    title,
    excerpt,
    content,
    tags,
  }: EditModalValues) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
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
        onEdit?.();
        reset();
        closeEditModal();
        toast.success("Post updated!");
      } else {
        toast.error("Failed to save changes. Check your input.");
      }
    } catch (err) {
      console.error("Error", err);
      toast.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return createPortal(
    <div onClick={closeEditModal} className={css.overlay}>
      <div onClick={(e) => e.stopPropagation()} className={css.modal}>
        <button
          type="button"
          className={css.closeButton}
          onClick={closeEditModal}
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
        <h3 className={css.title}>Edit post</h3>
        <form onSubmit={handleSubmit(handleEdit)} className={css.form}>
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
            Save changes
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}

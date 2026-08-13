"use client";

import { useForm } from "react-hook-form";
import css from "./CommentForm.module.css";
import { useBlogStore } from "@/store/blogStore";
import Loader from "../Loader/Loader";

type CommentFormValues = {
  content: string;
};

type CommentFormProps = {
  postId: string;
  onPosted?: () => void;
};

export default function CommentForm({ postId, onPosted }: CommentFormProps) {
  const { handleSubmit, reset, register } = useForm<CommentFormValues>();
  const isLoading = useBlogStore((state) => state.isLoading);
  const setLoading = useBlogStore((state) => state.setLoading);

  const handlePostComment = async ({ content }: CommentFormValues) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        onPosted?.();
      }
    } catch (err) {
      console.error("Error: ", err);
    } finally {
      setLoading(false);
      reset();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <form onSubmit={handleSubmit(handlePostComment)} className={css.form}>
      <textarea
        {...register("content")}
        placeholder="Add a comment"
        className={css.input}
      />
      <button type="submit" className={css.button}>
        Post a comment
      </button>
    </form>
  );
}

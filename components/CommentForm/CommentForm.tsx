"use client";

import { useForm } from "react-hook-form";
import type { KeyboardEvent } from "react";
import css from "./CommentForm.module.css";
import { toast } from "sonner";

type CommentFormValues = {
  content: string;
};

type CommentFormProps = {
  postId: string;
  onPosted?: () => void;
};

export default function CommentForm({ postId, onPosted }: CommentFormProps) {
  const { handleSubmit, reset, register } = useForm<CommentFormValues>();

  const handlePostComment = async ({ content }: CommentFormValues) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        onPosted?.();
        reset();
      } else {
        toast.error("Failed to post comment. Check your input.");
      }
    } catch (err) {
      console.error("Error: ", err);
      toast.error("Failed to post comment.");
    }
  };

  const handleKeySumbit = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(handlePostComment)();
    }
  };

  return (
    <form onSubmit={handleSubmit(handlePostComment)} className={css.form}>
      <textarea
        {...register("content")}
        placeholder="Add a comment"
        className={css.input}
        onKeyDown={handleKeySumbit}
      />
      <button type="submit" className={css.button}>
        Post a comment
      </button>
    </form>
  );
}

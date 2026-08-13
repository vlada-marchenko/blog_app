"use client";

import css from "./PostCard.module.css";
import { useComments } from "@/hooks/useComments";
import type { Post } from "@/types/post";
import { useAuth } from "../AuthProvider/AuthProvider";
import { formatDate } from "@/lib/formatDate";
import CommentForm from "@/components/CommentForm/CommentForm";
import CommentList from "../CommentList/CommentList";

type PostCardProps = {
  post: Post;
  onBack: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function PostCard({
  post,
  onBack,
  onDelete,
  onEdit,
}: PostCardProps) {
  const user = useAuth();
  const owner = user?.uid === post.authorId;
  const { mutate } = useComments(post.id);

  return (
    <div className={css.card}>
      <button
        type="button"
        className={css.back}
        onClick={onBack}
        aria-label="Back to list"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15L7 10L12 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>
      <div className={css.tags}>
        {post.tags?.map((tag) => (
          <span key={tag} className={css.tag}>
            {tag}
          </span>
        ))}
      </div>
      <h3 className={css.title}>{post.title}</h3>
      <div className={css.name}>
        <span className={css.text}>{post.authorName}</span>
        <span className={css.text}>{formatDate(post.createdAt)}</span>
      </div>
      {owner && (
        <div className={css.buttons}>
          <button className={css.edit} onClick={() => onEdit(post.id)}>
            Edit
          </button>
          <button className={css.delete} onClick={() => onDelete(post.id)}>
            Delete
          </button>
        </div>
      )}
      <p className={css.description}>{post.content}</p>
      <div className={css.comments}>
        <span className={css.count}>Comments ({post.commentCount})</span>
        {user && <CommentForm postId={post.id} onPosted={mutate} />}
        <CommentList postId={post.id} />
      </div>
    </div>
  );
}

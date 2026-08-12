"use client";

import css from "./PostList.module.css";
import { usePosts } from "@/hooks/usePosts";
import Loader from "../Loader/Loader";
import { formatDate } from "@/lib/formatDate";

type PostListProps = {
  onSelect: (id: string) => void;
};

export default function PostList({ onSelect }: PostListProps) {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <Loader />;
  if (error) return <p className={css.state}>Failed to load posts.</p>;
  if (!posts?.length) return <p className={css.state}>No posts yet.</p>;

  return (
    <div className={css.list}>
      {posts.map((post) => (
        <div
          key={post.id}
          className={css.card}
          onClick={() => onSelect(post.id)}
        >
          <div className={css.tags}>
            {post.tags?.map((tag) => (
              <span key={tag} className={css.tag}>
                {tag}
              </span>
            ))}
          </div>
          <h3 className={css.title}>{post.title}</h3>
          <p className={css.excerpt}>{post.excerpt}</p>
          <div className={css.name}>
            <span className={css.text}>{post.authorName}</span>
            <span className={css.text}>{formatDate(post.createdAt)}</span>
            <span className={css.text}>{post.commentCount} comments</span>
          </div>
        </div>
      ))}
    </div>
  );
}

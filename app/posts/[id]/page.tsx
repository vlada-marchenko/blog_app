"use client";

import { useParams, useRouter } from "next/navigation";
import { usePost } from "@/hooks/usePost";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "@/components/PostCard/PostCard";
import Loader from "@/components/Loader/Loader";
import css from "../../page.module.css";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: post, isLoading, mutate } = usePost(id);
  const { mutate: mutatePosts } = usePosts();

  const handleEdit = () => {
    mutate();
    mutatePosts();
  };

  const handleDelete = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) {
      mutatePosts();
      router.push("/");
    }
  };

  if (isLoading) return <Loader />;
  if (!post) {
    return <p className={css.page}>Post not found.</p>;
  }

  return (
    <div className={css.page}>
      <PostCard
        post={post}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCommentPosted={mutatePosts}
      />
    </div>
  );
}

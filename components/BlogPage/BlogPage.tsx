"use client";

import { useBlogStore } from "@/store/blogStore";
import PostList from "../PostList/PostList";
import PostCard from "../PostCard/PostCard";
import { usePosts } from "@/hooks/usePosts";

export default function BlogPage() {
  const { data: posts, mutate } = usePosts();
  const selectedId = useBlogStore((state) => state.selectedId);
  const setSelectedId = useBlogStore((state) => state.setSelectedId);

  const selectedPost = posts?.find((post) => post.id === selectedId);

  const handleEdit = () => {
    mutate();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (res.ok) setSelectedId(null);
    mutate();
  };

  if (selectedPost) {
    return (
      <PostCard
        post={selectedPost}
        onBack={() => setSelectedId(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return <PostList onSelect={setSelectedId} />;
}

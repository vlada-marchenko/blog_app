"use client";

import { useBlogStore } from "@/store/blogStore";
import PostList from "../PostList/PostList";
import PostCard from "../PostCard/PostCard";
import { usePosts } from "@/hooks/usePosts";

export default function BlogPage() {
  const { data: posts } = usePosts();
  const selectedId = useBlogStore((state) => state.selectedId);
  const setSelectedId = useBlogStore((state) => state.setSelectedId);

  const selectedPost = posts?.find((post) => post.id === selectedId);

  const handleEdit = () => {};

  const handleDelete = () => {};

  if (selectedPost) {
    return (
      <PostCard
        post={selectedPost}
        onBack={() => setSelectedId(null)}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
  }

  return <PostList onSelect={setSelectedId} />;
}

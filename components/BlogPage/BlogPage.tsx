"use client";

import { useState } from "react";
import PostList from "../PostList/PostList";
import PostCard from "../PostCard/PostCard";
import { usePosts } from "@/hooks/usePosts";

export default function BlogPage() {
  const { data: posts } = usePosts();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedPost = posts?.find((post) => post.id === selectedId);

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

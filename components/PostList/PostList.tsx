"use client";

import css from "./PostList.module.css";
import { usePosts } from "@/hooks/usePosts";
import Loader from "../Loader/Loader";
import { formatDate } from "@/lib/formatDate";
import PostFilters from "../PostFilters/PostFilters";
import { useMemo, useState } from "react";
import { useBlogStore } from "@/store/blogStore";
import { useDebounce } from "@uidotdev/usehooks";

type PostListProps = {
  onSelect: (id: string) => void;
};

const ITEMS_PER_PAGE = 6;

export default function PostList({ onSelect }: PostListProps) {
  const { data: posts, isLoading, error } = usePosts();
  const search = useBlogStore((state) => state.searchQuery);
  const selectedTag = useBlogStore((state) => state.tag);
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);

  const filterKey = `${debouncedSearch}_${selectedTag ?? ""}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts?.forEach((post) => post.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    const searchQuery = debouncedSearch.toLowerCase().trim();
    return posts?.filter((post) => {
      const matchQuery =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery) ||
        post.excerpt.toLowerCase().includes(searchQuery) ||
        post.content.toLowerCase().includes(searchQuery);

      const matchTags = !selectedTag || post.tags.includes(selectedTag);
      return matchQuery && matchTags;
    });
  }, [posts, debouncedSearch, selectedTag]);

  const visiblePosts = filteredPosts.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = visiblePosts.length < filteredPosts.length;

  if (isLoading) return <Loader />;
  if (error) return <p className={css.state}>Failed to load posts.</p>;
  if (!posts?.length) return <p className={css.state}>No posts yet.</p>;

  return (
    <div className={css.container}>
      <PostFilters tags={tags} />
      <div className={css.list}>
        {!filteredPosts?.length ? (
          <p className={css.state}>No posts match your filters.</p>
        ) : (
          visiblePosts?.map((post) => (
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
          ))
        )}
      </div>

      {hasMore && (
        <div className={css.pagination}>
          <button
            type="button"
            className={css.loadMoreBtn}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

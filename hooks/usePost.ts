import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import type { Post } from "../types/post";

export function usePost(postId: string) {
  const { data, error, isLoading, mutate } = useSWR<Post>(
    postId ? `/api/posts/${postId}` : null,
    fetcher,
  );
  return { data, error, isLoading, mutate };
}

import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import type { Post } from "../types/post";

export function usePosts() {
  const { data, error, isLoading } = useSWR<Post[]>(`/api/posts`, fetcher);
  return { data, error, isLoading };
}

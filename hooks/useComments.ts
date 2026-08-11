import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import type { Comment } from "../types/comment";

export function useComments(postId: string) {
  const { data, error, isLoading } = useSWR<Comment[]>(
    postId ? `/api/posts/${postId}/comments` : null,
    fetcher,
  );
  return { data, error, isLoading };
}

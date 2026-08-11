export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  commentCount: number;
  content: string;
  createdAt: string;
  excerpt: string;
  tags: string[];
  title: string;
  updatedAt: string;
}

import * as z from "zod";

export const postSchema = z.object({
  excerpt: z.string().min(10).max(300),
  tags: z.array(z.string().min(1, "Tag cannot be empty")),
  title: z.string().min(2).max(100),
  content: z.string().min(10).max(1000),
});

import * as z from "zod";

export const postSchema = z.object({
  title: z
    .string("Title is required")
    .trim()
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title cannot exceed 100 characters"),

  excerpt: z
    .string("Excerpt is required")
    .trim()
    .min(10, "Excerpt must be at least 5 characters long")
    .max(300, "Excerpt cannot exceed 300 characters"),

  content: z
    .string("Content is required")
    .trim()
    .min(10, "Content must be at least 10 characters long")
    .max(1000, "Content cannot exceed 1,000 characters"),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty")
        .max(20, "Tag cannot exceed 20 characters"),
      "Tags are required",
    )
    .min(1, "Please provide at least 1 tag")
    .max(3, "You can select up to 3 tags"),
});

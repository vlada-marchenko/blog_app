import * as z from "zod";

export const commentSchema = z.object({
  content: z.string().min(10).max(1000),
});

import * as z from "zod";

export const commentSchema = z.object({
  content: z.string().max(1000, "Content must be up to 1000 symbols"),
});

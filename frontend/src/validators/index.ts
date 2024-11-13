import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" }),
  content: z
    .string()
    .min(20, { message: "Content must be at least 20 characters long" }),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Content must be at least 1 character long" }),
});

export type PostData = z.infer<typeof postSchema>;
export type CommentData = z.infer<typeof commentSchema>;

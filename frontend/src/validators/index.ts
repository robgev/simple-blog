import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" }),
  content: z
    .string()
    .min(20, { message: "Content must be at least 20 characters long" }),
});

export type PostData = z.infer<typeof postSchema>;

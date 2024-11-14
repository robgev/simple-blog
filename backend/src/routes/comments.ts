import express, { Request, Response } from "express";
import { z } from "zod";
import { supabase } from "../supabase";
import { POSTS_PAGE_SIZE } from "../constants";
import { authenticateUser, authorizeCommentChange } from "../middlewares/auth";
import { ServerError } from "../utils/error";

// Path params are not accessible by default by
// sub-routes. We need mergeParams to access post_id
const router = express.Router({ mergeParams: true });

const postSchema = z.object({
  id: z.number().or(z.undefined()),
  content: z.string().min(1),
  post_id: z.string(),
  by_user: z.string(),
});

const upsert = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { post_id } = req.params;
  const { user } = res.locals;
  const payload = {
    ...req.body,
    post_id,
    by_user: user.id,
    ...(id ? { id } : {}),
  };
  const validated = postSchema.parse(payload);
  const { data, error } = await supabase
    .from("comments")
    .upsert(validated)
    .select();

  if (error) throw new ServerError(400, error.message);

  res.status(req.body.id ? 200 : 201).json(data);
};

router.post("/", authenticateUser, upsert);
router.put("/:id", authenticateUser, authorizeCommentChange, upsert);

router.get("/", authenticateUser, async (req: Request, res: Response) => {
  const { page } = req.query;
  const { post_id } = req.params;

  if (!page) throw new Error("Specify page number");

  const pageNumber = parseInt(page as string);
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      by_user (
        id,
        email
      )
    `,
    )
    .eq("post_id", post_id)
    // supabase range function is 0 based and right inclusive
    .range(
      pageNumber * POSTS_PAGE_SIZE,
      (pageNumber + 1) * POSTS_PAGE_SIZE - 1,
    );

  if (error) throw new ServerError(400, error.message);
  res
    .status(200)
    .json({ items: data, hasMore: data.length === POSTS_PAGE_SIZE });
});

router.delete(
  "/:id",
  authenticateUser,
  authorizeCommentChange,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) throw new ServerError(400, error.message);
    res.status(204).send("Deleted Successfully");
  },
);

export default router;

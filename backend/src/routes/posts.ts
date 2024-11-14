import express, { Request, Response } from "express";
import { z } from "zod";
import { supabase } from "../supabase";
import { POSTS_PAGE_SIZE } from "../constants";
import { authenticateUser, authorizePostChange } from "../middlewares/auth";
import { ServerError } from "../utils/error";

const router = express.Router();

const postSchema = z.object({
  id: z.number().or(z.undefined()),
  title: z.string().min(1),
  content: z.string().min(1),
  created_by: z.string(),
});

const upsert = async (req: Request, res: Response) => {
  const { user } = res.locals;
  const id = parseInt(req.params.id);
  const payload = {
    ...req.body,
    ...(id ? { id } : {}),
    created_by: user.id,
  };
  const validated = postSchema.parse(payload);
  const { data, error } = await supabase
    .from("posts")
    .upsert(validated)
    .select();
  if (error) throw new ServerError(400, (error as Error).message);
  res.status(req.params.id ? 200 : 201).json(data);
};

router.post("/", authenticateUser, upsert);
router.put("/:id", authenticateUser, authorizePostChange, upsert);

router.get("/", authenticateUser, async (req: Request, res: Response) => {
  const { page } = req.query;

  if (!page) throw new ServerError(400, "Specify page number");

  const pageNumber = parseInt(page as string);
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      created_by (
        id,
        email
      )
    `,
    )
    .order("id")
    // supabase range function is 0 based and right inclusive
    .range(
      pageNumber * POSTS_PAGE_SIZE,
      (pageNumber + 1) * POSTS_PAGE_SIZE - 1,
    );

  if (error) throw new ServerError(400, (error as Error).message);
  res
    .status(200)
    .json({ items: data, hasMore: data.length === POSTS_PAGE_SIZE });
});

router.get(
  "/:id",
  authenticateUser,
  authorizePostChange,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        content,
        created_by (
          id,
          email
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw new ServerError(400, (error as Error).message);
    res.status(200).send(data);
  },
);

router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) throw new ServerError(400, (error as Error).message);
  res.status(204).send("Deleted Successfully");
});

export default router;

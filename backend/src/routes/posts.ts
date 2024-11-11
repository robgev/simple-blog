import express, { Request, Response } from "express";
import { z } from "zod";
import { supabase } from "../supabase";
import { POSTS_PAGE_SIZE } from "../constants";
import { authenticateUser, authorizePostChange } from "../middlewares/auth";

const router = express.Router();

const postSchema = z.object({
  id: z.number().or(z.undefined()),
  title: z.string().min(1),
  content: z.string().min(1),
  created_by: z.string(),
});

const upsert = async (req: Request, res: Response) => {
  try {
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
    if (error) throw error;
    res.status(req.params.id ? 200 : 201).json(data);
  } catch (error) {
    // Error has type unknown in typescript
    // We just typecast for a quick solution
    res.status(400).json({ error: (error as Error).message });
  }
};

router.post("/", authenticateUser, upsert);
router.put("/:id", authenticateUser, authorizePostChange, upsert);

router.get("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { page } = req.query;

    if (!page) throw new Error("Specify page number");

    const pageNumber = parseInt(page as string);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id")
      // supabase range function is 0 based and right inclusive
      .range(
        pageNumber * POSTS_PAGE_SIZE,
        (pageNumber + 1) * POSTS_PAGE_SIZE - 1,
      );

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get(
  "/:id",
  authenticateUser,
  authorizePostChange,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id);

      if (error) throw error;
      res.status(200).send(data);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
);

router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;
    res.status(204).send("Deleted Successfully");
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;

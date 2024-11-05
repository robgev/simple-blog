import express, { Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../supabase';
import { POSTS_PAGE_SIZE } from '../constants';
import { authenticateUser, authorizeCommentChange } from '../middlewares/auth';

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
  try {
    const { post_id } = req.params
    const { user } = res.locals;
    const payload = {
      ...req.body,
      post_id,
      by_user: user.id,
    }
    const validated = postSchema.parse(payload);
    const { data, error } = await supabase.from('comments')
      .upsert(validated)
      .select();
    if (error) throw error;
    res.status(req.body.id ? 200 : 201).json(data);
  } catch (error) {
    // Error has type unknown in typescript
    // We just typecast for a quick solution
    res.status(400).json({ error: (error as Error).message });
  }
}

router.post('/', authenticateUser, upsert);
router.put('/', authenticateUser, authorizeCommentChange, upsert);

router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    const { post_id } = req.params

    if (!page) throw new Error("Specify page number");

    const pageNumber = parseInt(page as string);
    const { data, error } = await supabase.from('comments')
      .select("*")
      .eq('post_id', post_id)
      // supabase range function is 0 based and right inclusive
      .range(pageNumber * POSTS_PAGE_SIZE, (pageNumber + 1) * POSTS_PAGE_SIZE - 1);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', authenticateUser, authorizeCommentChange, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send('Deleted Successfully');
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;

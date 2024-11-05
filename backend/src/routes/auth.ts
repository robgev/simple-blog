import express, { Request, Response } from 'express';
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { authenticateUser } from '../middlewares/auth';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { data: { session }, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!session) throw new Error("No session");
    if(err) throw err;

    const { access_token, refresh_token } = session;
    const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token
    })

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    const err = (error as AuthError);
    res.status(err?.status || 400).json({ error: err?.message });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
  const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    const err = (error as AuthError);
    res.status(err?.status || 400).json({ error: err?.message });
  }
});

router.get('/', authenticateUser, async (_: Request, res: Response) => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    const err = (error as AuthError);
    res.status(err?.status || 400).json({ error: err?.message });
  }
});

export default router;

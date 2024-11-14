import express, { Request, Response } from "express";
import { supabase } from "../supabase";
import { authenticateUser } from "../middlewares/auth";
import { ServerError } from "../utils/error";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const {
    data: { session },
    error: err,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!session) throw new ServerError(401, "No session");
  if (err) throw new ServerError(401, err.message);

  const { access_token, refresh_token } = session;
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (!data.user) throw new ServerError(401, "No user");

  const { id, role } = data.user;
  const user = {
    id,
    role,
    email,
    access_token,
    refresh_token,
  };
  if (error) throw new ServerError(error?.status || 400, error?.message);
  res.status(200).json(user);
});

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (!data.user) throw new ServerError(400, "Sign up failed");

  const { id, role } = data.user;
  const user = {
    id,
    role,
    email,
  };
  if (error) throw new ServerError(error?.status || 400, error?.message);
  res.status(201).json(user);
});

router.get("/", authenticateUser, async (_: Request, res: Response) => {
  const { email, id } = res.locals.user;

  res.status(200).json({ id, email });
});

export default router;

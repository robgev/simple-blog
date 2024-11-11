import { Request, Response, NextFunction } from "express";
import { TUser } from "../types";
import { supabase } from "../supabase";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // We use Bearer tokens
  const token = req.header("authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
  } else {
    // We could also just use getUser
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      res.status(401).json({ error });
    } else {
      res.locals.user = user;
    }

    next();
  }
};

export const authorizeCommentChange = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = res.locals.user as TUser;
  const { post_id } = req.params;

  const { data, error } = await supabase
    .from("comments")
    .select("by_user")
    .eq("post_id", post_id);

  if (error || !data) {
    res.status(500).json({ error: !data ? "Comment does not exist" : error });
  } else {
    const { by_user } = data[0];

    if (user?.role !== "admin" || user.id !== by_user) {
      res.status(403).json({ error: "Forbidden" });
    }
  }

  next();
};

export const authorizePostChange = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = res.locals.user as TUser;
  const { id } = req.params;

  const { data, error } = await supabase
    .from("posts")
    .select("created_by")
    .eq("id", id);

  if (error || !data) {
    res.status(500).json({ error: !data ? "Comment does not exist" : error });
  } else {
    const { created_by } = data[0];

    if (user?.role !== "admin" && user.id !== created_by) {
      res.status(403).json({ error: "Forbidden" });
    }
  }

  next();
};

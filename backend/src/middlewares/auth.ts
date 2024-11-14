import { Request, Response, NextFunction } from "express";
import { AuthError } from "@supabase/supabase-js";
import { TUser } from "../types";
import { supabase } from "../supabase";
import { ServerError } from "../utils/error";

// Apparently express has a bug that doesn't let it
// handle errors inside async middlewares properly
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // We use Bearer tokens
    const token = req.header("authorization")?.split(" ")[1];

    if (!token) {
      throw new ServerError(401, "No token provided");
    }

    // We could also just use getUser
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      throw new ServerError(401, error.message);
    }

    res.locals.user = user;

    next();
  } catch (error) {
    next(new ServerError(401, (error as AuthError).message));
  }
};

export const authorizeCommentChange = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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

      if (user?.role !== "admin" && user.id !== by_user) {
        res.status(403).json({ error: "Forbidden" });
      }
    }

    next();
  } catch (error) {
    next(new ServerError(403, "Forbidden"));
  }
};

export const authorizePostChange = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    next(new ServerError(403, "Forbidden"));
  }
};

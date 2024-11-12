import { Request, Response, NextFunction } from "express";
import { ServerError } from "../utils/error";

export default (
  err: ServerError,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.message) {
    const { message } = err;
    res.status(err.status).json({
      message,
    });
  } else {
    // All non-synthetic errors
    console.error(err); // For debugging purposes
    res.status(500).json({
      errorCode: "Unknown",
      message: "Something went wrong...",
      error: err,
    });
  }
  next();
};

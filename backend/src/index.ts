import express from "express";
import cors from "cors";
import "dotenv/config";

import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";
import authRoutes from "./routes/auth";
import errorHandler from "./middlewares/errorHandler";

const app = express();
const port = process.env.PORT || 3000;

app
  // Libs
  .use(cors())
  .use(express.json())

  // Routes
  .use("/api/user", authRoutes)
  .use("/api/posts", postRoutes)
  .use("/api/posts/:post_id/comments", commentRoutes)

  // Error handling/monitoring
  .use(errorHandler)
  .get("/", (_, res) => {
    res.send("Healthy");
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

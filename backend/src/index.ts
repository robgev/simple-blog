import express from "express";
import cors from "cors";
import "dotenv/config";

import { supabase } from "./supabase";
import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/posts/:post_id/comments', commentRoutes);

app.get('/', (_, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

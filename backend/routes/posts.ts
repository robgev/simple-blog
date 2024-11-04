import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    console.log("HERE");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

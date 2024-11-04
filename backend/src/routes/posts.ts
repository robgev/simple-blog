import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    console.log("HERE");
  } catch (error) {
    const err = new Error(error as string);
    res.status(400).json({ error: err.message });
  }
});

export default router;

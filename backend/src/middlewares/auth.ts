import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TUser } from '../types';

const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET!;

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  // We use Bearer tokens 
  const token = req.header("authorization")?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
  } else {
    // We could also just use getUser
    jwt.verify(token, supabaseJwtSecret, (err, user) => {
      if (err) {
        res.status(401).json({ error: 'Invalid token' });
      }
      res.locals.user = user;
      next();
    });
  }
};

export const authorizeUser = (role: string) => {
  return (_: Request, res: Response, next: NextFunction) => {
    const user = (res.locals.user as TUser)
    if (user?.role !== role) {
      res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

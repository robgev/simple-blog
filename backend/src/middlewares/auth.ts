import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TUser } from '../types';
import { supabase } from '../supabase';

const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET!;

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  // We use Bearer tokens 
  const token = req.header("authorization")?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
  } else {
    // We could also just use getUser
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      res.status(401).json({ error })
    } else {
      res.locals.user = user;
    }

    next()
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

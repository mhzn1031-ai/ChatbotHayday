import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  userId: string;
  user: any;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { subscription: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    (req as AuthenticatedRequest).userId = user.id;
    (req as AuthenticatedRequest).user = user;
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const requireSubscription = (plans: string[] = ['PRO', 'BUSINESS']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!user.subscription || !plans.includes(user.subscription.plan)) {
      return res.status(403).json({ 
        error: 'This feature requires a subscription upgrade.',
        requiredPlans: plans
      });
    }
    
    next();
  };
};
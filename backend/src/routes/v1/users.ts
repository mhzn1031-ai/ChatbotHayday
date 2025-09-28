import express from 'express';
import { authenticate } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import { prisma } from '../../config/database';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const user = (req as any).user;
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    subscription: user.subscription,
    createdAt: user.createdAt
  });
}));

// Update user profile
router.put('/profile', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { name, email } = req.body;
  
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, email },
    include: { subscription: true }
  });
  
  res.json({
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    subscription: updatedUser.subscription
  });
}));

export default router;
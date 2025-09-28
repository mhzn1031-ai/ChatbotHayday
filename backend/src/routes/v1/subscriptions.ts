import express from 'express';
import { authenticate } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();

// Placeholder routes for subscriptions
router.get('/', authenticate, asyncHandler(async (req, res) => {
  res.json({ message: 'Subscriptions endpoint - implementation pending' });
}));

export default router;
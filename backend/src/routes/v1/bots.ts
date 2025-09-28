import express from 'express';
import { authenticate } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import { prisma } from '../../config/database';

const router = express.Router();

// Get all bots for user
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  
  const bots = await prisma.bot.findMany({
    where: { userId },
    include: {
      config: true,
      _count: {
        select: {
          documents: true,
          websites: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  res.json(bots);
}));

// Create new bot
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { name, description } = req.body;
  
  const bot = await prisma.bot.create({
    data: {
      name,
      description,
      userId,
      config: {
        create: {
          welcomeMessage: 'Hello! How can I help you today?',
          primaryColor: '#3B82F6',
          secondaryColor: '#F1F5F9'
        }
      }
    },
    include: { config: true }
  });
  
  res.status(201).json(bot);
}));

// Get specific bot
router.get('/:botId', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { botId } = req.params;
  
  const bot = await prisma.bot.findFirst({
    where: { id: botId, userId },
    include: {
      config: true,
      documents: true,
      websites: true
    }
  });
  
  if (!bot) {
    return res.status(404).json({ error: 'Bot not found' });
  }
  
  res.json(bot);
}));

// Update bot
router.put('/:botId', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { botId } = req.params;
  const { name, description } = req.body;
  
  const bot = await prisma.bot.findFirst({
    where: { id: botId, userId }
  });
  
  if (!bot) {
    return res.status(404).json({ error: 'Bot not found' });
  }
  
  const updatedBot = await prisma.bot.update({
    where: { id: botId },
    data: { name, description },
    include: { config: true }
  });
  
  res.json(updatedBot);
}));

// Delete bot
router.delete('/:botId', authenticate, asyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  const { botId } = req.params;
  
  const bot = await prisma.bot.findFirst({
    where: { id: botId, userId }
  });
  
  if (!bot) {
    return res.status(404).json({ error: 'Bot not found' });
  }
  
  await prisma.bot.delete({
    where: { id: botId }
  });
  
  res.status(204).send();
}));

export default router;
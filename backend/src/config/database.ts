import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const prisma = new PrismaClient();

export async function connectDatabase() {
  try {
    // Connect to PostgreSQL via Prisma
    await prisma.$connect();
    logger.info('Connected to PostgreSQL database');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot-docs';
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB database');

  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    await mongoose.disconnect();
    logger.info('Disconnected from databases');
  } catch (error) {
    logger.error('Database disconnection failed:', error);
  }
}
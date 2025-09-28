import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { logger, auditLogger } from './utils/logger';
import { errorHandler, notFound } from './middleware/errorHandler';
import { rateLimitConfig } from './middleware/rateLimiter';
import { securityMiddleware } from './middleware/security';

// V1 Routes with versioning
import authRoutes from './routes/v1/auth';
import userRoutes from './routes/v1/users';
import botRoutes from './routes/v1/bots';
import documentRoutes from './routes/v1/documents';
import subscriptionRoutes from './routes/v1/subscriptions';
import analyticsRoutes from './routes/v1/analytics';
import webhookRoutes from './routes/v1/webhooks';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Enhanced rate limiting with different tiers
app.use('/api/v1/auth', rateLimitConfig.auth);
app.use('/api/v1/chat', rateLimitConfig.chat);
app.use('/api/v1', rateLimitConfig.general);

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook verification
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info('API Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Health check with detailed status
app.get('/health', async (req, res) => {
  try {
    // Check database connectivity
    const dbStatus = await checkDatabaseHealth();
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbStatus,
        redis: 'OK', // Add Redis health check
        ai_service: 'OK' // Add AI service health check
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      error: 'Service unavailable'
    });
  }
});

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bots', botRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/webhooks', webhookRoutes);

// API documentation redirect
app.get('/api', (req, res) => {
  res.json({
    message: 'AI Chatbot SaaS API',
    version: 'v1',
    documentation: '/api/v1/docs',
    endpoints: {
      auth: '/api/v1/auth',
      bots: '/api/v1/bots',
      documents: '/api/v1/documents',
      analytics: '/api/v1/analytics'
    }
  });
});

// 404 handler
app.use('*', notFound);

// Global error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function checkDatabaseHealth() {
  // Add actual database health checks here
  return 'OK';
}

async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  // Close database connections
  // Close Redis connections
  // Finish processing current requests
  
  process.exit(0);
}

async function startServer() {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
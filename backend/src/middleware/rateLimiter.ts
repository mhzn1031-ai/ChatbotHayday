import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';

// Different rate limits for different endpoints
export const rateLimitConfig = {
  // Authentication endpoints - stricter limits
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
      error: 'Too many authentication attempts, please try again later',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded for auth', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path
      });
      res.status(429).json({
        error: 'Too many authentication attempts, please try again later',
        retryAfter: '15 minutes'
      });
    }
  }),

  // Chat endpoints - moderate limits
  chat: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // 20 messages per minute
    message: {
      error: 'Too many chat requests, please slow down',
      retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Rate limit by user ID if authenticated, otherwise by IP
      return (req as any).userId || req.ip;
    }
  }),

  // General API endpoints
  general: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
      error: 'Too many requests, please try again later',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    }
  }),

  // File upload endpoints - very strict
  upload: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour
    message: {
      error: 'Upload limit exceeded, please try again later',
      retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Webhook endpoints - moderate limits
  webhook: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // 50 webhooks per minute
    message: {
      error: 'Webhook rate limit exceeded',
      retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false
  })
};

// Anomaly detection middleware
export const anomalyDetection = (req: any, res: any, next: any) => {
  const suspiciousPatterns = [
    // SQL injection patterns
    /(\b(union|select|insert|delete|update|drop|create|alter)\b)/i,
    // XSS patterns
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    // Path traversal
    /\.\.\//g,
    // Command injection
    /[;&|`$()]/g
  ];

  const userInput = JSON.stringify(req.body) + req.url + JSON.stringify(req.query);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userInput)) {
      logger.warn('Suspicious request detected', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.url,
        method: req.method,
        pattern: pattern.toString(),
        userId: req.userId
      });
      
      return res.status(400).json({
        error: 'Invalid request format'
      });
    }
  }
  
  next();
};
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Log security events
  if (req.headers['x-forwarded-for'] || req.connection.remoteAddress) {
    logger.info('Request received', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent')
    });
  }
  
  next();
};
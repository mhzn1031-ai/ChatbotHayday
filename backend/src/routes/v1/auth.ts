import express from 'express';
import { authenticate } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import { AuthController } from '../../controllers/authController';

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post('/register', asyncHandler(authController.register.bind(authController)));
router.post('/login', asyncHandler(authController.login.bind(authController)));
router.post('/refresh', asyncHandler(authController.refreshToken.bind(authController)));

// Protected routes
router.post('/logout', authenticate, asyncHandler(authController.logout.bind(authController)));

export default router;
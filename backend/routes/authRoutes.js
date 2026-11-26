import express from 'express';
import * as auth from '../controllers/authController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/login', loginLimiter, asyncHandler(auth.login));
router.get('/me', authenticate, asyncHandler(auth.me));

export default router;

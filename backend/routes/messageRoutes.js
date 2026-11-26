import express from 'express';
import * as messages from '../controllers/messageController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAdmin } from '../middleware/auth.js';
import { createPublicWriteLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Public: contact form.
router.post('/', createPublicWriteLimiter(), asyncHandler(messages.createMessage));

// Admin only. Static paths are declared before '/:id'.
router.get('/', requireAdmin, asyncHandler(messages.listMessages));
router.get('/unread-count', requireAdmin, asyncHandler(messages.getUnreadCount));
router.get('/:id', requireAdmin, asyncHandler(messages.getMessage));
router.patch('/:id', requireAdmin, asyncHandler(messages.updateMessage));
router.delete('/:id', requireAdmin, asyncHandler(messages.deleteMessage));

export default router;

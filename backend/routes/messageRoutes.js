import express from 'express';
import * as messages from '../controllers/messageController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
const staffOnly = [authenticate, requireRole('admin', 'super_admin')];

// Public: contact form submission.
router.post('/', asyncHandler(messages.createMessage));

// Admin dashboards only.
router.get('/', ...staffOnly, asyncHandler(messages.listMessages));
router.get('/unread-count', ...staffOnly, asyncHandler(messages.getUnreadCount));
router.get('/:id', ...staffOnly, asyncHandler(messages.getMessage));
router.patch('/:id', ...staffOnly, asyncHandler(messages.updateMessage));
router.delete('/:id', ...staffOnly, asyncHandler(messages.deleteMessage));

export default router;

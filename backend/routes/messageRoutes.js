import express from 'express';
import * as messages from '../controllers/messageController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.post('/', asyncHandler(messages.createMessage));
router.get('/', asyncHandler(messages.listMessages));
router.get('/unread-count', asyncHandler(messages.getUnreadCount));
router.get('/:id', asyncHandler(messages.getMessage));
router.patch('/:id', asyncHandler(messages.updateMessage));
router.delete('/:id', asyncHandler(messages.deleteMessage));

export default router;

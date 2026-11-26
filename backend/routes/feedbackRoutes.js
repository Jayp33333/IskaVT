import express from 'express';
import * as feedback from '../controllers/feedbackController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAdmin } from '../middleware/auth.js';
import { createPublicWriteLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Public: native feedback form in the tour.
router.post('/', createPublicWriteLimiter(), asyncHandler(feedback.createFeedback));

// Admin only. Static paths are declared before '/:id'.
router.get('/', requireAdmin, asyncHandler(feedback.listFeedback));
router.get('/unread-count', requireAdmin, asyncHandler(feedback.getUnreadCount));
router.get('/stats/summary', requireAdmin, asyncHandler(feedback.getStatsSummary));
router.get('/:id', requireAdmin, asyncHandler(feedback.getFeedback));
router.patch('/:id', requireAdmin, asyncHandler(feedback.updateFeedback));
router.delete('/:id', requireAdmin, asyncHandler(feedback.deleteFeedback));

export default router;

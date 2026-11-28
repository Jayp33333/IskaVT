import express from 'express';
import * as feedback from '../controllers/feedbackController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
const staffOnly = [authenticate, requireRole('admin', 'super_admin')];

// Public: visitors submit feedback from the tour.
router.post('/', asyncHandler(feedback.createFeedback));

// Admin dashboards only.
router.get('/', ...staffOnly, asyncHandler(feedback.listFeedback));
router.get('/unread-count', ...staffOnly, asyncHandler(feedback.getUnreadCount));
router.get('/stats/summary', ...staffOnly, asyncHandler(feedback.getStatsSummary));
router.get('/:id', ...staffOnly, asyncHandler(feedback.getFeedback));
router.patch('/:id', ...staffOnly, asyncHandler(feedback.updateFeedback));
router.delete('/:id', ...staffOnly, asyncHandler(feedback.deleteFeedback));

export default router;

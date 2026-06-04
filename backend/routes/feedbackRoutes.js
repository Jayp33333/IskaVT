import express from 'express';
import * as feedback from '../controllers/feedbackController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.post('/', asyncHandler(feedback.createFeedback));
router.get('/', asyncHandler(feedback.listFeedback));
router.get('/unread-count', asyncHandler(feedback.getUnreadCount));
router.get('/stats/summary', asyncHandler(feedback.getStatsSummary));
router.get('/:id', asyncHandler(feedback.getFeedback));
router.patch('/:id', asyncHandler(feedback.updateFeedback));
router.delete('/:id', asyncHandler(feedback.deleteFeedback));

export default router;

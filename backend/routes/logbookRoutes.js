import express from 'express';
import * as logbook from '../controllers/logbookController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { optionalAuthenticate, requireAdmin } from '../middleware/auth.js';
import { createPublicWriteLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Public (visitor tour). Admin tokens are honoured on create so the admin
// "Add Visitor" form can set custom date/time values.
router.post(
  '/',
  createPublicWriteLimiter(),
  optionalAuthenticate,
  asyncHandler(logbook.createEntry)
);

// Admin only. Static paths are declared before '/:id'.
router.get('/', requireAdmin, asyncHandler(logbook.listEntries));
router.get('/stats/summary', requireAdmin, asyncHandler(logbook.getStatsSummary));

// Public: called by the tour, including a keepalive fetch with no auth header.
router.patch('/:id/timeout', asyncHandler(logbook.setTimeoutNow));
router.get('/:id', asyncHandler(logbook.getEntry));

router.patch('/:id', requireAdmin, asyncHandler(logbook.updateEntry));
router.delete('/:id', requireAdmin, asyncHandler(logbook.deleteEntry));

export default router;

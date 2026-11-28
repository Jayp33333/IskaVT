import express from 'express';
import * as logbook from '../controllers/logbookController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
const staffOnly = [authenticate, requireRole('admin', 'super_admin')];

// Public: visitors sign the logbook, view their own entry, and time out.
router.post('/', asyncHandler(logbook.createEntry));
router.patch('/:id/timeout', asyncHandler(logbook.setTimeoutNow));

// Admin dashboards only.
router.get('/', ...staffOnly, asyncHandler(logbook.listEntries));
router.get('/stats/summary', ...staffOnly, asyncHandler(logbook.getStatsSummary));

// Public (after /stats/summary so that path isn't captured as an :id).
router.get('/:id', asyncHandler(logbook.getEntry));

router.patch('/:id', ...staffOnly, asyncHandler(logbook.updateEntry));
router.delete('/:id', ...staffOnly, asyncHandler(logbook.deleteEntry));

export default router;

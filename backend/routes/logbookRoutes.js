import express from 'express';
import * as logbook from '../controllers/logbookController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.post('/', asyncHandler(logbook.createEntry));
router.get('/', asyncHandler(logbook.listEntries));
router.get('/stats/summary', asyncHandler(logbook.getStatsSummary));
router.get('/:id', asyncHandler(logbook.getEntry));
router.patch('/:id', asyncHandler(logbook.updateEntry));
router.patch('/:id/timeout', asyncHandler(logbook.setTimeoutNow));
router.delete('/:id', asyncHandler(logbook.deleteEntry));

export default router;

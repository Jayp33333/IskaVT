import express from 'express';
import * as settings from '../controllers/settingsController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', asyncHandler(settings.getPublicSettings));
router.get('/', authenticate, requireRole('super_admin'), asyncHandler(settings.getSettings));
router.patch('/', authenticate, requireRole('super_admin'), asyncHandler(settings.updateSettings));

export default router;

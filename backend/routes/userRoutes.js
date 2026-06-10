import express from 'express';
import * as users from '../controllers/userController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, requireRole('super_admin'));

router.get('/', asyncHandler(users.listAdmins));
router.post('/', asyncHandler(users.createAdmin));
router.patch('/:id', asyncHandler(users.updateAdmin));
router.delete('/:id', asyncHandler(users.deleteAdmin));

export default router;

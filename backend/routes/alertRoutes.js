// backend/routes/alertRoutes.js

import express from 'express';
import { getAlerts, markRead } from '../controllers/alertController.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';


const router = express.Router();

/**
 * @route   GET /api/alerts
 * @desc    Get all system alerts (admin only)
 * @access  Private/Admin
 */
router.get('/', authMiddleware, isAdmin, getAlerts);

/**
 * @route   PATCH /api/alerts/:id/read
 * @desc    Mark a specific alert as read
 * @access  Private/Admin
 */
router.patch('/:id/read', authMiddleware, isAdmin, markRead);

export default router;

// backend/routes/reportRoutes.js

import express from 'express';
import {
  submitReport,
  getReports,
  getPaidReports,
  getAllReports,
  flagReport,
} from '../controllers/reportController.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// ─── Routes for authenticated users ───────────────────────────────────────────
router.post('/', authMiddleware, submitReport);
router.get('/my', authMiddleware, getReports);
router.get('/paid', authMiddleware, getPaidReports);

// ─── Admin-only routes ────────────────────────────────────────────────────────
router.get('/all', authMiddleware, isAdmin, getAllReports);
router.patch('/:id/flag', authMiddleware, isAdmin, flagReport);

export default router;

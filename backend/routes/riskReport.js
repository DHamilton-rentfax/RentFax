// backend/routes/riskReport.js

import express from 'express';
import {
  createReport,
  getAllReports,
  getReportById,
} from '../controllers/riskReportController.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// ✅ Authenticated users can create a risk report
router.post('/', authMiddleware, createReport);

// ✅ Admins can fetch all reports
router.get('/', authMiddleware, isAdmin, getAllReports);

// ✅ Authenticated users can get report by ID (ownership logic optional)
router.get('/:id', authMiddleware, getReportById);

export default router;

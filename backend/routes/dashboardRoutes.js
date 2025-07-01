// backend/routes/dashboardRoutes.js

import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';


const router = express.Router();

// Only admin users can access dashboard data
router.get('/', authMiddleware, isAdmin, getDashboardData);

export default router;

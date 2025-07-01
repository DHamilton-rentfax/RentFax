// backend/routes/auditLogRoutes.js

import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/audit-logs
 * @desc    Return the 20 most recent audit logs
 * @access  Private (admin only)
 */
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (err) {
    console.error('[AuditLogRoutes] Error:', err.message);
    res.status(500).json({ error: 'Unable to fetch audit logs' });
  }
});

export default router;

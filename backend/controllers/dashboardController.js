// backend/controllers/dashboardController.js

import Report from '../models/Report.js';
import AuditLog from '../models/AuditLog.js';

// GET /api/dashboard
export const getDashboardData = async (req, res) => {
  try {
    const reports = await Report.find({});
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(10);

    const riskData = {
      low: reports.filter(r => r.riskScore < 30).length,
      medium: reports.filter(r => r.riskScore >= 30 && r.riskScore < 70).length,
      high: reports.filter(r => r.riskScore >= 70).length,
    };

    res.status(200).json({
      totalReports: reports.length,
      recentLogs: logs,
      riskData,
      reports,
    });
  } catch (err) {
    console.error('❌ Dashboard Fetch Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data.' });
  }
};

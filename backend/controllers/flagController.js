// backend/controllers/flagController.js

import Report from '../models/Report.js';

//
// 🔹 Flag a Report (Admin Only)
//
export const flagReport = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id; // comes from auth middleware (token)

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    // Update report fields
    report.status = 'flagged';
    report.flaggedBy = adminId;
    report.riskLevel = 'high';
    await report.save();

    res.status(200).json({ message: '✅ Report flagged successfully.', report });
  } catch (err) {
    console.error('❌ Error flagging report:', err);
    res.status(500).json({ message: 'Failed to flag report.' });
  }
};

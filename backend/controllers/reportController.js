// backend/controllers/reportController.js
import Report from '../models/Report.js';
import AuditLog from '../models/AuditLog.js';

// ─────────────────────────────────────────────────────────────────────────────
// Submit a new report (authenticated user)
export async function submitReport(req, res, next) {
  try {
    const report = new Report(req.body);

    // Attach metadata for logging
    report._userId = req.user.id;
    report._ip = req.ip;
    report._agent = req.headers['user-agent'];

    // Auto-risk scoring
    report.calculateRiskScore?.();
    report.autoFlag?.();

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
}

// Get current user's reports
export async function getReports(req, res, next) {
  try {
    const reports = await Report.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
}

// Get paid reports for user
export async function getPaidReports(req, res, next) {
  try {
    const reports = await Report.find({
      createdBy: req.user.id,
      status: 'paid',
    }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
}

// Admin: Get all reports
export async function getAllReports(req, res, next) {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
}

// Admin: Flag a report
export async function flagReport(req, res, next) {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    report.status = 'flagged';
    report.flaggedBy = req.user.email || req.user.id;

    // Attach audit metadata
    report._userId = req.user.id;
    report._ip = req.ip;
    report._agent = req.headers['user-agent'];

    await report.save();

    await AuditLog.create({
      action: 'flag',
      model: 'Report',
      reportId: report._id,
      changedBy: req.user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      data: report.toObject(),
    });

    res.json({ message: 'Report flagged successfully.', report });
  } catch (err) {
    next(err);
  }
}

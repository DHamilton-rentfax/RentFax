// backend/controllers/riskReportController.js

import RiskReport from '../models/RiskReport.js';
import { getRentalHistory } from '../services/rentalHistory.js'; // ✅ Fixed import
import { verifyIdentity } from '../services/identityVerification.js';
import Blacklist from '../models/Blacklist.js';

/**
 * POST /api/risk-reports
 * Create a new risk report:
 * 1️⃣ Validate input
 * 2️⃣ Verify identity (stub)
 * 3️⃣ Fetch rental history
 * 4️⃣ Compute fraudScore
 * 5️⃣ Check blacklist and override riskLevel if needed
 * 6️⃣ Save (pre-save hook derives riskLevel) & return
 */
export async function createReport(req, res, next) {
  try {
    const { title, details = '', applicant, applicantId } = req.body;

    // 1️⃣ Validate required fields
    if (!title || !applicant) {
      return res
        .status(400)
        .json({ error: 'Missing required fields: title and applicant.' });
    }

    const {
      name,
      dob,
      licenseNumber,
      phone = '',
      email = '',
      _id // if passed from frontend
    } = applicant;

    if (!name || !dob || !licenseNumber) {
      return res
        .status(400)
        .json({ error: 'Applicant must include name, dob, and licenseNumber.' });
    }

    // 2️⃣ Verify identity (stubbed)
    const identityVerification = await verifyIdentity({
      name,
      dob,
      licenseNum: licenseNumber
    });

    // 3️⃣ Base report instance
    const report = new RiskReport({
      title,
      details,
      applicant: { name, dob, licenseNumber, phone, email },
      submittedBy: req.user.id,
      account:     req.user.account,
      identityVerification,
    });

    // 4️⃣ Try to fetch rental history
    let records = [];
    try {
      const historyDoc = await getRentalHistory(_id || applicantId);
      records = historyDoc?.records || [];
    } catch (err) {
      console.warn('⚠️ Rental history not found or error:', err.message);
    }

    report.rentalHistory = {
      records,
      retrieved: new Date(),
    };

    // 5️⃣ Compute fraudScore (max 100)
    report.fraudScore = Math.min(records.length * 10, 100);
    // → riskLevel will be auto-set via pre('save')

    // 6️⃣ Check blacklist
    const isBlacklisted = await Blacklist.exists({ licenseNumber });
    if (isBlacklisted) {
      report.blacklisted = true;
      report.riskLevel   = 'high';
    }

    // 7️⃣ Save & return
    const saved = await report.save();
    return res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/risk-reports
 * Admin-only: list all reports for this account.
 */
export async function getAllReports(req, res, next) {
  try {
    const reports = await RiskReport.find({ account: req.user.account })
      .sort('-createdAt')
      .exec();
    return res.json(reports);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/risk-reports/:id
 * Authenticated users may fetch a report if it belongs to their account.
 */
export async function getReportById(req, res, next) {
  try {
    const report = await RiskReport.findOne({
      _id:     req.params.id,
      account: req.user.account,
    }).exec();

    if (!report) {
      return res.status(404).json({ error: 'Risk report not found.' });
    }
    return res.json(report);
  } catch (err) {
    next(err);
  }
}

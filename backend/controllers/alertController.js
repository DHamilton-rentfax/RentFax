// backend/controllers/alertController.js

import Alert from '../models/Alerts.js';

/**
 * GET /api/alerts
 * Admin-only: list all alerts for this account.
 */
export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({ account: req.user.account })
      .sort('-createdAt')
      .populate('report', 'title riskLevel')
      .exec();

    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/alerts/:id/read
 * Admin-only: mark an alert as read.
 */
export const markRead = async (req, res, next) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, account: req.user.account },
      { read: true },
      { new: true }
    ).exec();

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found.' });
    }

    res.json(alert);
  } catch (err) {
    next(err);
  }
};

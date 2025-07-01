// backend/routes/rentalHistoryRoutes.js

import express from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware/auth.js';
import RentalHistory from '../models/RentalHistory.js';

const router = express.Router();

// ─── CREATE ─ Add new history document or append entries ───────────────────────
router.post('/applicants/:id/history', authMiddleware, async (req, res, next) => {
  const { id: applicantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(applicantId)) {
    return res.status(400).json({ error: 'Invalid applicant ID.' });
  }

  try {
    let history = await RentalHistory.findOne({ applicant: applicantId });

    if (!history) {
      history = new RentalHistory({ applicant: applicantId, entries: [] });
    }

    if (!Array.isArray(req.body.entries)) {
      return res.status(400).json({ error: 'Entries must be an array.' });
    }

    history.entries.push(...req.body.entries);
    await history.save();

    res.status(201).json(history);
  } catch (err) {
    next(err);
  }
});

// ─── READ ─ Get full rental history ─────────────────────────────────────────────
router.get('/applicants/:id/history', authMiddleware, async (req, res, next) => {
  const { id: applicantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(applicantId)) {
    return res.status(400).json({ error: 'Invalid applicant ID.' });
  }

  try {
    const history = await RentalHistory.findOne({ applicant: applicantId });

    if (!history) {
      return res.status(404).json({ error: 'No rental history found.' });
    }

    res.json(history);
  } catch (err) {
    next(err);
  }
});

// ─── UPDATE ─ Modify a single history entry ─────────────────────────────────────
router.patch('/applicants/:id/history/:entryId', authMiddleware, async (req, res, next) => {
  const { id: applicantId, entryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(applicantId) || !mongoose.Types.ObjectId.isValid(entryId)) {
    return res.status(400).json({ error: 'Invalid applicant or entry ID.' });
  }

  try {
    const updated = await RentalHistory.findOneAndUpdate(
      { applicant: applicantId, 'entries._id': entryId },
      { $set: { 'entries.$': req.body } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'No matching history entry found to update.' });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ─── DELETE ─ Remove a single entry ─────────────────────────────────────────────
router.delete('/applicants/:id/history/:entryId', authMiddleware, async (req, res, next) => {
  const { id: applicantId, entryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(applicantId) || !mongoose.Types.ObjectId.isValid(entryId)) {
    return res.status(400).json({ error: 'Invalid applicant or entry ID.' });
  }

  try {
    const history = await RentalHistory.findOne({ applicant: applicantId });

    if (!history) {
      return res.status(404).json({ error: 'No rental history found.' });
    }

    const originalLength = history.entries.length;
    history.entries = history.entries.filter(entry => !entry._id.equals(entryId));

    if (history.entries.length === originalLength) {
      return res.status(404).json({ error: 'No matching history entry found to delete.' });
    }

    await history.save();
    res.json({ message: 'Entry removed.', history });
  } catch (err) {
    next(err);
  }
});

export default router;

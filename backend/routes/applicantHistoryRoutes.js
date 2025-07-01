// backend/routes/applicantHistoryRoutes.js

import express from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware/auth.js';
import RentalHistory from '../models/RentalHistory.js';

const router = express.Router();

// ─── Ownership Middleware ─────────────────────────────────────────────────────
function checkOwnership(req, res, next) {
  const { role, id: userId } = req.user;
  const { id: applicantId } = req.params;
  if (role === 'admin' || userId === applicantId) {
    return next();
  }
  return res.status(403).json({ error: 'Access denied.' });
}

// ─── Validate ObjectId ────────────────────────────────────────────────────────
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid applicant ID.' });
  }
  next();
}

// ─── GET Applicant History ────────────────────────────────────────────────────
router.get('/:id/history', authMiddleware, checkOwnership, validateObjectId, async (req, res, next) => {
  try {
    const hist = await RentalHistory.findOne({ applicant: req.params.id });
    return res.status(200).json(hist || { applicant: req.params.id, leases: [] });
  } catch (err) {
    next(err);
  }
});

// ─── POST New Lease ────────────────────────────────────────────────────────────
router.post('/:id/history', authMiddleware, checkOwnership, validateObjectId, async (req, res, next) => {
  try {
    const { property, start, end, events = [] } = req.body;
    let hist = await RentalHistory.findOne({ applicant: req.params.id });

    const newLease = { property, start, end, events };

    if (!hist) {
      hist = new RentalHistory({ applicant: req.params.id, leases: [newLease] });
    } else {
      hist.leases.push(newLease);
    }

    await hist.save();
    return res.status(201).json(hist);
  } catch (err) {
    next(err);
  }
});

// ─── PATCH Update Lease ────────────────────────────────────────────────────────
router.patch('/:id/history/:leaseIndex', authMiddleware, checkOwnership, validateObjectId, async (req, res, next) => {
  try {
    const leaseIndex = Number(req.params.leaseIndex);
    if (isNaN(leaseIndex) || leaseIndex < 0) {
      return res.status(400).json({ error: 'Invalid lease index.' });
    }

    const hist = await RentalHistory.findOne({ applicant: req.params.id });
    if (!hist || !hist.leases[leaseIndex]) {
      return res.status(404).json({ error: 'Lease not found.' });
    }

    Object.assign(hist.leases[leaseIndex], req.body);
    await hist.save();
    return res.status(200).json(hist);
  } catch (err) {
    next(err);
  }
});

// ─── DELETE Lease ──────────────────────────────────────────────────────────────
router.delete('/:id/history/:leaseIndex', authMiddleware, checkOwnership, validateObjectId, async (req, res, next) => {
  try {
    const leaseIndex = Number(req.params.leaseIndex);
    if (isNaN(leaseIndex) || leaseIndex < 0) {
      return res.status(400).json({ error: 'Invalid lease index.' });
    }

    const hist = await RentalHistory.findOne({ applicant: req.params.id });
    if (!hist || !hist.leases[leaseIndex]) {
      return res.status(404).json({ error: 'Lease not found.' });
    }

    hist.leases.splice(leaseIndex, 1);
    await hist.save();
    return res.status(200).json(hist);
  } catch (err) {
    next(err);
  }
});

// ─── POST Add Lease Event ──────────────────────────────────────────────────────
router.post('/:id/history/:leaseIndex/events', authMiddleware, checkOwnership, validateObjectId, async (req, res, next) => {
  try {
    const leaseIndex = Number(req.params.leaseIndex);
    const { title, description, date } = req.body;

    const hist = await RentalHistory.findOne({ applicant: req.params.id });
    const lease = hist?.leases[leaseIndex];

    if (!lease) {
      return res.status(404).json({ error: 'Lease not found.' });
    }

    lease.events.push({ title, description, date });
    await hist.save();
    return res.status(201).json(hist);
  } catch (err) {
    next(err);
  }
});

// ─── DELETE Lease Event ────────────────────────────────────────────────────────
router.delete('/:id/history/:leaseIndex/events/:eventIndex', authMiddleware, checkOwnership, validateObjectId, async (req, res, next) => {
  try {
    const leaseIndex = Number(req.params.leaseIndex);
    const eventIndex = Number(req.params.eventIndex);

    const hist = await RentalHistory.findOne({ applicant: req.params.id });
    const lease = hist?.leases[leaseIndex];

    if (!lease || !lease.events[eventIndex]) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    lease.events.splice(eventIndex, 1);
    await hist.save();
    return res.status(200).json(hist);
  } catch (err) {
    next(err);
  }
});

export default router;

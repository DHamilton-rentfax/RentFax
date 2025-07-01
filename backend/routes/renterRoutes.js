// backend/routes/renterRoutes.js
import express from 'express';
import Renter from '../models/Renter.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/renters — Create a new renter
router.post('/', authMiddleware, isAdmin, async (req, res, next) => {
  try {
    const renter = new Renter(req.body);
    await renter.save();
    res.status(201).json(renter);
  } catch (err) {
    next(err);
  }
});

// Future: Add GET /api/renters or GET /api/tags

export default router;

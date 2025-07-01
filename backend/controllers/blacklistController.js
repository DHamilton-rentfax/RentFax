// backend/controllers/blacklistController.js

import Blacklist from '../models/Blacklist.js';

/**
 * GET /api/blacklist
 * Admin-only: list all blacklisted entries
 */
const getBlacklist = async (req, res, next) => {
  try {
    const list = await Blacklist.find().sort('-createdAt').exec();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/blacklist
 * Admin-only: add a new entry
 * Body: { licenseNumber, name?, reason? }
 */
const addToBlacklist = async (req, res, next) => {
  try {
    const { licenseNumber, name = '', reason = '' } = req.body;
    if (!licenseNumber) {
      return res.status(400).json({ error: 'licenseNumber is required.' });
    }
    const entry = new Blacklist({ licenseNumber, name, reason });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Already blacklisted.' });
    }
    next(err);
  }
};

/**
 * DELETE /api/blacklist/:id
 * Admin-only: remove an entry by its ID
 */
const removeFromBlacklist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await Blacklist.findByIdAndDelete(id);
    if (!entry) {
      return res.status(404).json({ error: 'Not found.' });
    }
    res.json({ message: 'Removed from blacklist.' });
  } catch (err) {
    next(err);
  }
};

export { getBlacklist, addToBlacklist, removeFromBlacklist };

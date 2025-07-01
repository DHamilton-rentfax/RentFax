// backend/controllers/rentalHistoryController.js

import { getRentalHistory } from '../services/rentalHistory.js';

export async function fetchHistory(req, res, next) {
  try {
    const history = await getRentalHistory(req.params.id);
    res.json(history);
  } catch (err) {
    // your errorHandler middleware can inspect err.status
    next(err);
  }
}

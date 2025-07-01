// backend/routes/rentalEvents.js

import express from 'express';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/rentalEventController.js';

import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes below require authentication
router.use(authMiddleware);

// 🔍 Get all rental events
router.get('/', getEvents);

// ➕ Create a new rental event
router.post('/', createEvent);

// ✏️ Update an existing rental event
router.put('/:id', updateEvent);

// ❌ Delete a rental event
router.delete('/:id', deleteEvent);

export default router;

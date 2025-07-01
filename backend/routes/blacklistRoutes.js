// backend/routes/blacklistRoutes.js

import express from 'express';
import {
  getBlacklist,
  addToBlacklist,
  removeFromBlacklist,
} from '../controllers/blacklistController.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';


const router = express.Router();

// Admin-only endpoints
router.get('/', authMiddleware, isAdmin, getBlacklist);
router.post('/', authMiddleware, isAdmin, addToBlacklist);
router.delete('/:id', authMiddleware, isAdmin, removeFromBlacklist);

export default router;

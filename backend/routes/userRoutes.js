// backend/routes/userRoutes.js

import express from 'express';
import { deleteUser } from '../controllers/userController.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * DELETE /api/users/:id
 * Access: Admin only
 * Prevents self-deletion
 */
router.delete('/:id', authMiddleware, isAdmin, deleteUser);

export default router;

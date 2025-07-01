// backend/routes/authRoutes.js

import express from 'express';
import {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js'; // ✅ Correct import

const router = express.Router();

/**
 * ── Public Routes ───────────────────────────────────
 */
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

/**
 * ── Protected Routes (require valid JWT) ────────────
 */
router.use(authMiddleware); // ✅ Secure all routes below

router.post('/logout', logout);
router.get('/me', getMe);

export default router;

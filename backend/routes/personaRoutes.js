// backend/routes/personaRoutes.js
import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  savePersonaResult,
  personaWebhook,
} from '../controllers/personaController.js';

const router = express.Router();

/**
 * @route   POST /api/persona/result
 * @desc    Save the final Persona result after verification
 * @access  Protected (requires auth token)
 */
router.post('/result', requireAuth, savePersonaResult);

/**
 * @route   POST /api/persona/webhook
 * @desc    Webhook endpoint for Persona to send events
 * @access  Public (no auth required)
 */
router.post('/webhook', personaWebhook);

export default router;

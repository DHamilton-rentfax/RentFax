// backend/routes/stripeRoutes.js
import express from 'express';
import Stripe from 'stripe';
import {
  createCheckoutSession,
  createBillingPortalSession,
  handleWebhook,
  getAllTransactions
} from '../controllers/stripeController.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);

// ─── Create Checkout Session ─────────────────────────────────────────────────
router.post(
  '/create-checkout-session',
  authMiddleware,
  createCheckoutSession
);

// ─── Billing Portal Session ──────────────────────────────────────────────────
router.get(
  '/customer-portal',
  authMiddleware,
  createBillingPortalSession
);

// ─── Stripe Webhook ───────────────────────────────────────────────────────────
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

// ─── Admin: View All Transactions ─────────────────────────────────────────────
router.get(
  '/transactions',
  authMiddleware,
  isAdmin,
  getAllTransactions
);

export default router;

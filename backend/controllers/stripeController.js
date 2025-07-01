// backend/controllers/stripeController.js

import Stripe from 'stripe';
import Report from '../models/Report.js';
import Transaction from '../models/Transaction.js';
import { createAuditLog } from '../utils/createAuditLog.js';

const stripe = new Stripe(process.env.STRIPE_SECRET);

/**
 * Helper function to generate the line item for the session based on the plan type
 */
function generateLineItem(planType, reportId) {
  const lineItems = {
    'one-time': {
      price_data: {
        currency: 'usd',
        product_data: { name: 'RentFAX Risk Report' },
        unit_amount: 2000, // $20.00 in cents
      },
      quantity: 1,
    },
    'pro': {
      price: process.env.STRIPE_PRICE_PRO,
      quantity: 1,
    },
    'unlimited': {
      price: process.env.STRIPE_PRICE_UNLIMITED,
      quantity: 1,
    },
  };

  if (!lineItems[planType]) {
    throw new Error('Invalid plan type selected.');
  }

  return lineItems[planType];
}

/**
 * Create a Stripe Checkout Session
 */
export async function createCheckoutSession(req, res) {
  try {
    const { planType, reportId, applyCoupon } = req.body;
    const lineItem = generateLineItem(planType, reportId);

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [lineItem],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      mode: planType === 'one-time' ? 'payment' : 'subscription',
      metadata: { reportId: reportId || 'unknown' },
    };

    if (applyCoupon) {
      sessionConfig.discounts = [{ coupon: process.env.STRIPE_COUPON_ID }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe Checkout Error:', err.message);
    res.status(500).json({ error: `Failed to create Stripe checkout session: ${err.message}` });
  }
}

/**
 * Create a Billing Portal Session
 */
export async function createBillingPortalSession(req, res) {
  try {
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ error: 'Missing customer ID.' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/profile`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe Billing Portal Error:', err.message);
    res.status(500).json({ error: `Failed to create billing portal session: ${err.message}` });
  }
}

/**
 * Stripe Webhook Handler to update report status and log transactions
 */
export async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Webhook Signature Verification Error:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const reportId = session.metadata.reportId;

    try {
      const updatedReport = await Report.findByIdAndUpdate(reportId, { status: 'paid' });

      if (!updatedReport) {
        return res.status(404).send('Report not found');
      }

      await createAuditLog({
        model: 'Report',
        documentId: reportId,
        action: 'Payment Received',
        changedBy: session.customer_email,
        data: { status: 'paid', amount: session.amount_total / 100 },
      });

      const transaction = new Transaction({
        reportId,
        amount: session.amount_total / 100,
        status: 'completed',
      });

      await transaction.save();
      res.status(200).send('Webhook handled successfully');
    } catch (err) {
      console.error('❌ Error processing payment:', err.message);
      res.status(500).send('Error handling payment session');
    }
  } else {
    res.status(200).send('Event type not handled');
  }
}

/**
 * Get All Transactions (Admin Only)
 */
export async function getAllTransactions(req, res) {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error('❌ Error fetching transactions:', err.message);
    res.status(500).json({ error: `Failed to fetch transactions: ${err.message}` });
  }
}

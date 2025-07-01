import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Report from '../models/Report.js';
import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import { sendReceipt } from '../utils/sendEmail.js';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET, { apiVersion: '2023-10-16' });

//
// 🔹 Stripe Webhook Listener
//
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  // 🔐 Verify Stripe Signature
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    logger.info({
      service: 'stripe-webhook',
      eventType: event.type,
      receivedAt: new Date().toISOString(),
    });
  } catch (err) {
    logger.error({
      service: 'stripe-webhook',
      message: '❌ Stripe signature verification failed',
      error: err.message,
    });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🎯 Handle Specific Stripe Events
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleSubscriptionPaymentSuccess(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
      default:
        logger.info({
          service: 'stripe-webhook',
          message: `Unhandled event type: ${event.type}`,
        });
    }
  } catch (err) {
    logger.error({
      service: 'stripe-webhook',
      message: `❌ Error handling Stripe event: ${event.type}`,
      error: err.message,
    });
  }

  res.status(200).json({ received: true });
});

//
// 🔹 Handle Checkout Session Completed (Reports)
//
const handleCheckoutSessionCompleted = async (session) => {
  try {
    const metadata = session.metadata;
    if (!metadata?.report) {
      logger.error({
        service: 'stripe-webhook',
        message: 'Missing report metadata in session',
      });
      return;
    }

    const reportData = JSON.parse(metadata.report);

    // 🔁 Skip Duplicate Reports
    const exists = await Report.findOne({
      name: reportData.name,
      dob: reportData.dob,
      licenseNumber: reportData.licenseNumber,
    });

    if (exists) {
      logger.info({
        service: 'stripe-webhook',
        message: 'Duplicate report detected',
        reportData,
      });
      return;
    }

    // 📝 Create and Save Report
    const report = new Report(reportData);
    await report.calculateRiskScore();
    if (typeof report.autoFlag === 'function') await report.autoFlag();
    await report.save();

    // 📧 Send Email Receipt
    if (reportData.email) {
      await sendReceipt(reportData.email, reportData);
    }

    // 🕵🏽 Create Audit Log
    await AuditLog.create({
      action: 'stripe.checkout.completed',
      model: 'Report',
      reportId: report._id,
      changedBy: reportData.email || 'stripe_user',
      data: report.toObject(),
    });

    logger.info({
      service: 'stripe-webhook',
      message: '✅ Report saved successfully after checkout',
      reportId: report._id,
    });
  } catch (err) {
    logger.error({
      service: 'stripe-webhook',
      message: '❌ Error processing checkout.session.completed',
      error: err.message,
    });
  }
};

//
// 🔹 Handle Subscription Payment Success
//
const handleSubscriptionPaymentSuccess = async (invoice) => {
  try {
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;

    let plan = 'free';
    if (priceId === process.env.STRIPE_PRICE_PRO) plan = 'pro';
    else if (priceId === process.env.STRIPE_PRICE_UNLIMITED) plan = 'unlimited';

    const user = await User.findOneAndUpdate(
      { stripeCustomerId: customerId },
      { plan },
      { new: true }
    );

    if (user) {
      logger.info({
        service: 'stripe-webhook',
        message: `✅ User subscription upgraded`,
        userId: user._id,
        newPlan: plan,
      });
    } else {
      logger.warn({
        service: 'stripe-webhook',
        message: `⚠️ No user found for customer ID ${customerId}`,
      });
    }
  } catch (err) {
    logger.error({
      service: 'stripe-webhook',
      message: '❌ Error processing invoice.payment_succeeded',
      error: err.message,
    });
  }
};

//
// 🔹 Handle Subscription Canceled
//
const handleSubscriptionCanceled = async (subscription) => {
  try {
    const customerId = subscription.customer;

    const user = await User.findOneAndUpdate(
      { stripeCustomerId: customerId },
      { plan: 'free' },
      { new: true }
    );

    if (user) {
      logger.info({
        service: 'stripe-webhook',
        message: `⚡ User subscription canceled, downgraded to free`,
        userId: user._id,
      });
    } else {
      logger.warn({
        service: 'stripe-webhook',
        message: `⚠️ No user found for customer ID ${customerId}`,
      });
    }
  } catch (err) {
    logger.error({
      service: 'stripe-webhook',
      message: '❌ Error processing customer.subscription.deleted',
      error: err.message,
    });
  }
};

export default router;

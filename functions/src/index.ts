
'use server';

import Stripe from 'stripe';
import { onRequest } from 'firebase-functions/v2/onRequest';
import { onCall, HttpsError } from 'firebase-functions/v2/onCall';
import { PLAN_FEATURES, Plan, CompanyStatus, nextStatus } from '../../src/lib/plan-features'; 
import { admin, dbAdmin as db } from '../../src/lib/firebase-admin';
import * as functions from "firebase-functions";
import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}


// Ensure Stripe is initialized with a default empty string if API key is not set,
// although it should always be set in a real environment.
const stripe = new Stripe(process.env.STRIPE_API_KEY || '', { apiVersion: '2024-06-20' });

const PRICE_TO_PLAN: Record<string, Plan> = {
  [process.env.STRIPE_PRICE_STARTER || '']: 'starter',
  [process.env.STRIPE_PRICE_PRO || '']: 'pro',
  [process.env.STRIPE_PRICE_ENTERPRISE || '']: 'enterprise',
};

export const stripeWebhook = onRequest({ maxInstances: 1, secrets: ["STRIPE_API_KEY", "STRIPE_WEBHOOK_SECRET", "SENDGRID_API_KEY"] }, async (req, res) => {
  const sig = req.headers['stripe-signature'];
  if (!sig) {
    res.status(400).send('Missing stripe-signature header');
    return;
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig.toString(), secret);
  } catch (err: any) {
    console.error('Webhook signature verification failed', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        if (metadata.type === 'payg_report') {
            const userId = metadata.uid;
            const companyId = metadata.companyId;
            const email = session.customer_email;

            if (userId && companyId) {
                const companyRef = db.doc(`companies/${companyId}`);
                await companyRef.set({
                    reportCredits: admin.firestore.FieldValue.increment(1)
                }, { merge: true });
                
                console.log(`✅ PAYG: Added 1 report credit to company ${companyId}`);

                 // Audit log
                await db.collection("auditLogs").add({
                    action: "PAYG_PURCHASE",
                    actorUid: userId,
                    companyId: companyId,
                    after: { creditsAdded: 1 },
                    at: admin.firestore.FieldValue.serverTimestamp(),
                });

                // SendGrid Email Receipt
                if (email) {
                    const msg = {
                    to: email,
                    from: {
                        email: "receipts@rentfax.ai",
                        name: "RentFAX",
                    },
                    subject: "Your RentFAX Report Credit",
                    html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                        <h2>✅ Thank you for your purchase</h2>
                        <p>Hello,</p>
                        <p>You have successfully purchased <strong>1 Report Credit</strong> for RentFAX.</p>
                        <p><strong>Amount Paid:</strong> $20</p>
                        <p>Your new credit balance is now available in your dashboard.</p>
                        <p>👉 <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #4f46e5; font-weight: bold;">View My Dashboard</a></p>
                        <br/>
                        <p style="font-size: 12px; color: gray;">
                            RentFAX © ${new Date().getFullYear()} | This is an automated receipt for your records.
                        </p>
                        </div>
                    `,
                    };
                    await sgMail.send(msg);
                    console.log(`📧 Receipt sent to ${email}`);
                }
            }
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;

        const priceIds = (sub.items?.data || []).map(i => i.price?.id).filter(Boolean) as string[];
        const mappedPlan = priceIds.map(id => PRICE_TO_PLAN[id]).find(Boolean);
        const plan: Plan = mappedPlan || 'starter';

        const companyId = (sub.metadata?.companyId || '').trim();
        if (!companyId) {
          console.warn(`No companyId on subscription metadata for sub ID: ${sub.id}`);
          break;
        }
        
        const companyRef = db.doc(`companies/${companyId}`);
        const snap = await companyRef.get();
        const prevData = snap.data() || {};
        
        const isPaid = sub.status === 'active' || sub.status === 'trialing';
        const status = nextStatus(isPaid, prevData.status === 'active' || prevData.status === 'grace');

        await companyRef.set(
          {
            plan,
            status,
            stripe: {
              customer: typeof sub.customer === 'string' ? sub.customer : sub.customer?.id,
              subscription: sub.id,
              status: sub.status,
              current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
            },
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        console.log(`Updated company ${companyId} to plan ${plan} with status ${status}.`);
        break;
      }
    }
    res.json({ received: true });
  } catch (e: any) {
    console.error('Error in stripeWebhook handler:', e);
    res.status(500).send(`Webhook handler error: ${e.message}`);
  }
});

export const createBillingPortalSession = onCall({ secrets: ["STRIPE_API_KEY"] }, async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in required');
  const { companyId, role } = req.auth.token as any;
  if (!companyId || !['owner','manager'].includes(role)) {
    throw new HttpsError('permission-denied', 'Only owner/manager can open billing');
  }

  const company = await db.doc(`companies/${companyId}`).get();
  if (!company.exists) throw new HttpsError('not-found', 'Company not found');
  const customerId = company.data()?.stripe?.customer;
  if (!customerId) throw new HttpsError('failed-precondition', 'No Stripe customer on file');

  const returnUrl = process.env.STRIPE_PORTAL_RETURN_URL || 'http://localhost:9002/settings/billing';
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl
  });

  return { url: session.url };
});


export const notifyNewApplication = functions.firestore
  .document("applications/{appId}")
  .onCreate(async (snap) => {
    const app = snap.data();
    if (!app) return;

    const msg = {
      to: "hr@rentfax.ai", // your hiring inbox
      from: "noreply@rentfax.ai",
      subject: `New Application for ${app.role}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6">
          <h2>New Application: ${app.role}</h2>
          <p><strong>Name:</strong> ${app.name}</p>
          <p><strong>Email:</strong> ${app.email}</p>
          <p><strong>Cover Letter:</strong></p>
          <p>${app.coverLetter || "(none)"}</p>
          <p><a href="${app.resumeUrl}">Download Resume</a></p>
        </div>
      `,
    };

    try {
        await sgMail.send(msg);
        console.log(`Notified HR of new application: ${app.name}`);
    } catch(e: any) {
        console.error("Failed to send application notification email", e);
    }
  });

export * from './send-invite-email';
export * from './consume-credit';

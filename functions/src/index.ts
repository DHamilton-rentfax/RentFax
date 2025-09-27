
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
        const email = session.customer_email;

        // PAYG FLOW
        if (metadata.type === 'payg_report') {
            const uid = metadata.uid;
            const companyId = metadata.companyId;

            if (uid && companyId) {
                const companyRef = db.doc(`companies/${companyId}`);
                await companyRef.set({
                    reportCredits: admin.firestore.FieldValue.increment(1)
                }, { merge: true });
                
                console.log(`✅ PAYG: Added 1 report credit to company ${companyId}`);

                 await db.collection("auditLogs").add({
                    type: "PAYG_PURCHASE",
                    actorUid: uid,
                    companyId,
                    creditsAdded: 1,
                    timestamp: Date.now(),
                });

                if (email) {
                    await sgMail.send({
                        to: email,
                        from: { email: "receipts@rentfax.ai", name: "RentFAX" },
                        subject: "Your RentFAX Report Credit",
                        html: `
                            <h2>✅ Thank you for your purchase</h2>
                            <p>You have successfully purchased <strong>1 Report Credit</strong>.</p>
                            <p><strong>Amount Paid:</strong> $20</p>
                            <p>Your credit is now available in your dashboard.</p>
                            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View My Dashboard</a>
                        `,
                    });
                     console.log(`📧 Receipt sent to ${email}`);
                }
            }
        }

        // SUBSCRIPTION FLOW
        if (metadata.type === "subscription") {
          const companyId = metadata.companyId;
          const uid = metadata.uid;

          const lineItems = await stripe.checkout.sessions.listLineItems(
            session.id,
            { limit: 20 }
          );

          const addonKeys = lineItems.data
            .map((item) => item.price?.lookup_key)
            .filter((key) => key && key.startsWith("addon_")) as string[];

          if (addonKeys.length > 0) {
            await db
              .collection("companies")
              .doc(companyId)
              .set({ addons: addonKeys }, { merge: true });

            await db.collection("auditLogs").add({
              type: "ADDON_PURCHASE",
              actorUid: uid,
              companyId,
              addons: addonKeys,
              timestamp: Date.now(),
            });

            if (email) {
              for (const key of addonKeys) {
                const addonName = key
                  .replace("addon_", "")
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase());

                await sgMail.send({
                  to: email,
                  from: { email: "receipts@rentfax.ai", name: "RentFAX" },
                  subject: `Your ${addonName} Add-On is Now Active`,
                  html: `
                    <h2>✨ ${addonName} Activated</h2>
                    <p>Your add-on <strong>${addonName}</strong> is now active in RentFAX.</p>
                    <p>You can start using it in your dashboard immediately.</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a>
                  `,
                });
              }
            }
            console.log(`✅ Subscription: Activated add-ons ${addonKeys.join(", ")} for company ${companyId}`);
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

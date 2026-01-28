"use server";

import Stripe from "stripe";
import { getAdminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function getBillingStats() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  // 1. Users
  const usersSnap = await adminDb.collection("users").get();

  let totalPaidUsers = 0;
  let totalFreeUsers = 0;

  usersSnap.forEach((doc) => {
    const user = doc.data();
    const plan = user.subscription?.planId || "FREE";
    if (plan === "FREE") totalFreeUsers++;
    else totalPaidUsers++;
  });

  // 2. Credits Sold
  const creditsSnap = await adminDb.collection("billingLogs")
    .where("event", "==", "CREDITS_PURCHASED")
    .get();

  let creditsSold = 0;
  creditsSnap.forEach((d) => {
    creditsSold += d.data().credits ?? 0;
  });

  // 3. Identity checks today
  const identitySnap = await adminDb.collection("billingLogs")
    .where("event", "==", "IDENTITY_CHECK_CHARGED")
    .get();

  const identityChecksToday = identitySnap.size;

  // 4. Reports this month
  const reportSnap = await adminDb.collection("billingLogs")
    .where("event", "==", "FULL_REPORT_CHARGED")
    .get();

  const reportsThisMonth = reportSnap.size;

  // 5. Stripe MRR
  const subs = await stripe.subscriptions.list({ limit: 100 });
  let mrr = 0;

  subs.data.forEach((sub) => {
    if (sub.status === "active") {
      mrr += sub.items.data[0].price.unit_amount! / 100;
    }
  });

  // 6. Webhook health
  const webhookHealthy = true; // can be expanded later

  // 7. Anomaly detection
  const anomalies = {
    failedPayments: 0,
    unusuallyHighUsage: 0,
    suspiciousActivity: 0,
  };

  const failedSnap = await adminDb.collection("billingLogs")
    .where("event", "==", "PAYMENT_FAILED")
    .get();

  anomalies.failedPayments = failedSnap.size;

  return {
    mrr,
    totalPaidUsers,
    totalFreeUsers,
    creditsSold,
    identityChecksToday,
    reportsThisMonth,
    webhookHealthy,
    anomalies,
  };
}

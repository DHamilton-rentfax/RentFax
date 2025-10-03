import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { PubSub } from "@google-cloud/pubsub";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();
const pubsub = new PubSub();

// Helper to log alerts to Firestore
async function logAlert({
    type,
    message,
    channels,
    targetId,
    targetLink
}: {
    type: string;
    message: string;
    channels: string[];
    targetId?: string;
    targetLink?: string;
}) {
    await db.collection("alerts").add({
        type,
        message,
        channels,
        priority: "high",
        status: "open", // open | acknowledged | resolved
        createdAt: new Date(),
        ackBy: null,
        ackAt: null,
        resolvedAt: null,
        targetId: targetId || null,
        targetLink: targetLink || null,
    });
}

// Helper to send SMS via PubSub
async function sendEscalationSms(message: string) {
    const messageBuffer = Buffer.from(message, 'utf8');
    await pubsub.topic('sms-alerts').publish(messageBuffer);
}

export const checkCriticalAlerts = functions.pubsub
  .schedule("every 15 minutes")
  .timeZone("America/New_York")
  .onRun(async () => {
    const now = Date.now();
    let criticalAlertsFound = false;
    let summaryMessages: string[] = [];

    // 1. Disputes check
    const disputesSnap = await db.collection("disputes").where("status", "in", ["open", "pending"]).get();
    const overdueDisputes = disputesSnap.docs.filter(d => {
      const created = d.data().createdAt.toDate().getTime();
      return (now - created) / (1000*60*60*24) > 7;
    });

    if (overdueDisputes.length > 15) {
        criticalAlertsFound = true;
        summaryMessages.push(`⚖️ ${overdueDisputes.length} disputes overdue.`);

        for (const doc of overdueDisputes) {
            const disputeId = doc.id;
            const message = `Dispute ${disputeId} is overdue.`;
            await logAlert({
                type: "DISPUTE_OVERDUE",
                message,
                channels: ["sms", "slack", "email"],
                targetId: disputeId,
                targetLink: `/admin/super-dashboard/disputes/${disputeId}`,
            });
        }
    }

    // 2. Fraud check
    const fraudSnap = await db.collection("renters").where("alert","==",true).get();
    if (fraudSnap.size > 50) {
        criticalAlertsFound = true;
        const message = `🚩 ${fraudSnap.size} renters flagged for fraud.`;
        summaryMessages.push(message);
        await logAlert({
            type: "FRAUD_SPIKE",
            message,
            channels: ["sms", "slack", "email"],
            targetLink: `/admin/super-dashboard/fraud`,
        });
    }

    // 3. Active Chats check
    const chatSnap = await db.collection("chats").where("status","==","open").get();
    if (chatSnap.size > 20) {
        criticalAlertsFound = true;
        const message = `💬 ${chatSnap.size} active chats waiting.`;
        summaryMessages.push(message);
        await logAlert({
            type: "CHAT_OVERLOAD",
            message,
            channels: ["sms", "slack", "email"],
            targetLink: `/admin/super-dashboard/chat`,
        });
    }

    // 4. Revenue check
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const revenueSnap = await db.collection("billingEvents")
      .where("createdAt", ">=", weekAgo)
      .get();

    let netRevenue = 0;
    revenueSnap.forEach(doc => {
      const e = doc.data();
      if (e.type === "invoice.paid") netRevenue += e.amount || 0;
      if (e.type === "customer.subscription.deleted") netRevenue -= e.amount || 0;
    });

    if (netRevenue < 0) {
        criticalAlertsFound = true;
        const message = `💳 Negative net revenue this week: $${(netRevenue/100).toFixed(2)}.`;
        summaryMessages.push(message);
        await logAlert({
            type: "REVENUE_DROP",
            message,
            channels: ["sms", "slack", "email"],
            targetLink: `/admin/super-dashboard/billing`,
        });
    }
    
    // Send one summary SMS if any critical alerts were found
    if (criticalAlertsFound) {
        const summary = "🚨 RentFAX Critical Alerts: " + summaryMessages.join(" ");
        await sendEscalationSms(summary);
    }

    return null;
  });

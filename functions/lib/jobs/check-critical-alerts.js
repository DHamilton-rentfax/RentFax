"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCriticalAlerts = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const pubsub_1 = require("@google-cloud/pubsub");
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();
const pubsub = new pubsub_1.PubSub();
// Helper to log alerts to Firestore
async function logAlert({ type, message, channels, targetId, targetLink }) {
    await db.collection("alerts").add({
        type,
        message,
        channels,
        priority: "high",
        status: "open",
        createdAt: new Date(),
        ackBy: null,
        ackAt: null,
        resolvedAt: null,
        targetId: targetId || null,
        targetLink: targetLink || null,
    });
}
// Helper to send SMS via PubSub
async function sendEscalationSms(message) {
    const messageBuffer = Buffer.from(message, 'utf8');
    await pubsub.topic('sms-alerts').publish(messageBuffer);
}
exports.checkCriticalAlerts = functions.pubsub
    .schedule("every 15 minutes")
    .timeZone("America/New_York")
    .onRun(async () => {
    const now = Date.now();
    let criticalAlertsFound = false;
    let summaryMessages = [];
    // 1. Disputes check
    const disputesSnap = await db.collection("disputes").where("status", "in", ["open", "pending"]).get();
    const overdueDisputes = disputesSnap.docs.filter(d => {
        const created = d.data().createdAt.toDate().getTime();
        return (now - created) / (1000 * 60 * 60 * 24) > 7;
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
    const fraudSnap = await db.collection("renters").where("alert", "==", true).get();
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
    const chatSnap = await db.collection("chats").where("status", "==", "open").get();
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
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const revenueSnap = await db.collection("billingEvents")
        .where("createdAt", ">=", weekAgo)
        .get();
    let netRevenue = 0;
    revenueSnap.forEach(doc => {
        const e = doc.data();
        if (e.type === "invoice.paid")
            netRevenue += e.amount || 0;
        if (e.type === "customer.subscription.deleted")
            netRevenue -= e.amount || 0;
    });
    if (netRevenue < 0) {
        criticalAlertsFound = true;
        const message = `💳 Negative net revenue this week: $${(netRevenue / 100).toFixed(2)}.`;
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
//# sourceMappingURL=check-critical-alerts.js.map
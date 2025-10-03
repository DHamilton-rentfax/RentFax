import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

// This check is to prevent multiple initializations in the same session
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || "";

// Fire when new notifications are created
export const notifySlack = functions.firestore
  .document("notifications/{id}")
  .onCreate(async (snap) => {
    const data = snap.data();
    if (!data) return;

    // Only push high-priority alerts to Slack
    if (data.priority !== "high") return;

    const slackMessage = {
      text: `🚨 *${data.type.replace("_", " ")}*`,
      attachments: [
        {
          color: "#ff0000",
          fields: [
            { title: "Message", value: data.message, short: false },
            { title: "Link", value: `${process.env.APP_URL}${data.link || ""}`, short: false },
            { title: "Created At", value: new Date(data.createdAt.toDate()).toLocaleString(), short: true },
          ],
        },
      ],
    };

    try {
      await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackMessage),
      });
      console.log(`✅ Slack notified: ${data.type}`);
    } catch (err) {
      console.error("❌ Slack notification failed", err);
    }
  });

export { disputeSlaCheck } from "./jobs/dispute-sla-check";
export { dailyDigest, weeklyDigest } from "./jobs/digest";
export { sendSmsAlert } from "./jobs/sms-alert";
export { checkCriticalAlerts } from "./jobs/check-critical-alerts";
export { autoResolveDisputeAlerts } from "./triggers/auto-resolve-disputes";
export { autoResolveFraudAlerts } from "./triggers/auto-resolve-fraud";

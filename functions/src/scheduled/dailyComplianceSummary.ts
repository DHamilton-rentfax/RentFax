import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import { defineSecret } from "firebase-functions/params";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const slackWebhookUrl = defineSecret("SLACK_WEBHOOK_URL");
const adminEmail = defineSecret("ADMIN_EMAIL");
const nextPublicBaseUrl = defineSecret("NEXT_PUBLIC_BASE_URL");

export const dailyComplianceSummary = onSchedule(
  {
    schedule: "every day 08:00",
    secrets: [slackWebhookUrl, adminEmail, nextPublicBaseUrl],
  },
  async (event) => {
    const usersSnap = await db.collection("users").get();
    const users = usersSnap.docs.map((d) => d.data());
    const compliant = users.filter((u) => u.complianceStatus === "compliant").length;
    const nonCompliant = users.filter(
      (u) => u.complianceStatus === "non_compliant"
    ).length;
    const total = compliant + nonCompliant;
    const rate = total ? Math.round((compliant / total) * 100) : 0;

    const message = `📊 *Daily Compliance Summary*\nCompliant: ${compliant}\nNon-Compliant: ${nonCompliant}\nOverall Rate: ${rate}%\nDate: ${new Date().toLocaleDateString()}`;

    // Send to Slack
    if (slackWebhookUrl.value()) {
      await fetch(slackWebhookUrl.value(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });
    }

    // Send summary email
    if (adminEmail.value() && nextPublicBaseUrl.value()) {
      const summaryText = message.replace(/\*/g, ""); // strip markdown
      await fetch(`${nextPublicBaseUrl.value()}/api/notifications/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: adminEmail.value(),
          subject: "Daily Compliance Summary",
          text: summaryText,
        }),
      });
    }

    console.log("Daily compliance summary sent.");
  }
);

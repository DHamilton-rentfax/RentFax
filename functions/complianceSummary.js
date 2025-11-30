import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fetch from "node-fetch";

initializeApp();
const db = getFirestore();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // optional summary email target

export const sendDailyComplianceSummary = async () => {
  const usersSnap = await db.collection("users").get();
  const users = usersSnap.docs.map((d) => d.data());
  const compliant = users.filter((u) => u.complianceStatus === "compliant").length;
  const nonCompliant = users.filter((u) => u.complianceStatus === "non_compliant").length;
  const total = compliant + nonCompliant;
  const rate = total ? Math.round((compliant / total) * 100) : 0;

  const message = `📊 *Daily Compliance Summary*\nCompliant: ${compliant}\nNon-Compliant: ${nonCompliant}\nOverall Rate: ${rate}%\nDate: ${new Date().toLocaleDateString()}`;

  // Send to Slack
  if (SLACK_WEBHOOK_URL) {
    await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
  }

  // Send summary email
  if (ADMIN_EMAIL) {
    const summaryText = message.replace(/\*/g, ""); // strip markdown
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: ADMIN_EMAIL,
        subject: "Daily Compliance Summary",
        text: summaryText,
      }),
    });
  }

  console.log("Daily compliance summary sent.");
};

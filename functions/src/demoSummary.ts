
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";

admin.initializeApp();
const db = admin.firestore();

// Configure SMTP (e.g., Gmail, SendGrid, etc.)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

// Helper: get count by event type
async function countEvents(event: string, start: Date, end: Date) {
  const snap = await db
    .collection("demoAnalytics")
    .where("event", "==", event)
    .where("createdAt", ">=", start)
    .where("createdAt", "<=", end)
    .get();
  return snap.size;
}

// Scheduled function — runs weekly
export const sendWeeklyDemoSummary = functions.pubsub
  .schedule("every monday 09:00")
  .timeZone("America/New_York")
  .onRun(async () => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const renterCount = await countEvents("demo_role_selected", oneWeekAgo, now);
    const renterReportViews = await countEvents("demo_renter_report_viewed", oneWeekAgo, now);
    const companyCount = await countEvents("demo_company_dashboard_viewed", oneWeekAgo, now);

    const message = `
      Weekly RentFAX Demo Summary (last 7 days):

      👤 Renter demo entries: ${renterCount}
      📄 Renter report views: ${renterReportViews}
      🏢 Company demo entries: ${companyCount}

      Visit your Super Admin Dashboard for detailed logs.
    `;

    await transporter.sendMail({
      from: `"RentFAX Reports" <${process.env.MAILER_USER}>`,
      to: "info@rentfax.io",
      subject: "Weekly RentFAX Demo Summary",
      text: message,
    });

    console.log("✅ Weekly demo summary email sent");
  });

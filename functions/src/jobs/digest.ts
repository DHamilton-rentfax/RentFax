import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import fetch from "node-fetch";
import { PubSub } from "@google-cloud/pubsub";

// Initialize admin only if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();
const pubsub = new PubSub();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || "";
const DIGEST_EMAIL = process.env.DIGEST_EMAIL || "info@rentfax.io";

// Setup nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_PASS,
  },
});

// Helper to calculate percentage and avoid division by zero
const calcPercent = (part: number, total: number): string => {
  if (!total || total === 0) return "0.0%";
  return ((part / total) * 100).toFixed(1) + "%";
};

export const dailyDigest = functions.pubsub
  .schedule("every 24 hours") // runs daily
  .timeZone("America/New_York")
  .onRun(async () => {
    const now = Date.now();

    // 1. Disputes
    const disputesSnap = await db.collection("disputes").get();
    const unresolved = disputesSnap.docs.filter(d => ["open","pending"].includes(d.data().status)).length;
    const overdue = disputesSnap.docs.filter(d => {
      const created = new Date(d.data().createdAt.toDate()).getTime();
      return (now - created) / (1000*60*60*24) > 7 && d.data().status === "open";
    }).length;

    // 2. Fraud Alerts
    const fraudSnap = await db.collection("renters").where("alert","==",true).get();

    // 3. Active Chats
    const chatSnap = await db.collection("chats").where("status","==","open").get();

    // --- Escalation Logic ---
    let criticalAlert = "";
    if(overdue > 15) {
        criticalAlert += `Critical SLA breach: ${overdue} overdue disputes. `;
    }
    if(fraudSnap.size > 50) {
        criticalAlert += `Critical fraud alert spike: ${fraudSnap.size} active alerts. `;
    }

    if(criticalAlert !== "") {
        const messageBuffer = Buffer.from(criticalAlert, 'utf8');
        await pubsub.topic('sms-alerts').publish(messageBuffer);
    }

    // Format summary
    const summary = `
📊 RentFAX Daily Health Digest

- Unresolved Disputes: ${unresolved}
- Overdue Disputes (SLA > 7 days): ${overdue}
- Active Fraud Alerts: ${fraudSnap.size}
- Open Chats: ${chatSnap.size}

⚠️ SLA: ${overdue > 0 ? "Some disputes need urgent attention" : "All disputes within SLA"} 
🚨 Fraud: ${fraudSnap.size > 25 ? "High number of fraud alerts" : "Normal"} 
💬 Chats: ${chatSnap.size > 5 ? "Queue is growing" : "Healthy"} 
    `;

    // Send email
    try {
        await transporter.sendMail({
            from: `"RentFAX Digest" <${process.env.NOTIFY_EMAIL}>`,
            to: DIGEST_EMAIL,
            subject: "📊 RentFAX Daily Health Digest",
            text: summary,
        });
    } catch(err) {
        console.error("Error sending digest email:", err);
    }


    // Send Slack
    if (SLACK_WEBHOOK_URL) {
        try {
            await fetch(SLACK_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: summary }),
            });
        } catch(err) {
            console.error("Error sending digest to slack:", err);
        }
    }

    console.log("✅ Daily digest sent");
    return null;
  });

  
export const weeklyDigest = functions.pubsub
.schedule("every Monday 08:00")
.timeZone("America/New_York")
.onRun(async () => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);

    // ---------- 1. Ops Health ----------
    const disputesSnap = await db.collection("disputes").get();
    const unresolved = disputesSnap.docs.filter(d => ["open","pending"].includes(d.data().status)).length;
    const overdue = disputesSnap.docs.filter(d => {
      const created = d.data().createdAt.toDate().getTime();
      return (Date.now() - created) / (1000*60*60*24) > 7 && d.data().status === "open";
    }).length;

    const fraudSnap = await db.collection("renters").where("alert","==",true).get();
    const chatSnap = await db.collection("chats").where("status","==","open").get();

    // ---------- 2. Stripe Revenue ----------
    const revenueSnap = await db.collection("billingEvents")
      .where("createdAt", ">=", oneWeekAgo)
      .get();

    let newRevenue = 0;
    let churned = 0;
    revenueSnap.forEach(doc => {
      const e = doc.data();
      if (e.type === "invoice.paid") newRevenue += e.amount || 0;
      if (e.type === "customer.subscription.deleted") churned += e.amount || 0;
    });

    const netRevenue = newRevenue - churned;
    
    // ---------- Escalation Logic for Revenue Drop ----------
    const prevRevenueSnap = await db.collection("billingEvents")
        .where("createdAt", ">=", twoWeeksAgo)
        .where("createdAt", "<", oneWeekAgo)
        .get();

    let prevNewRevenue = 0;
    let prevChurned = 0;
    prevRevenueSnap.forEach(doc => {
        const e = doc.data();
        if (e.type === "invoice.paid") prevNewRevenue += e.amount || 0;
        if (e.type === "customer.subscription.deleted") prevChurned += e.amount || 0;
    });
    const prevNetRevenue = prevNewRevenue - prevChurned;

    if (prevNetRevenue > 0 && netRevenue < prevNetRevenue * 0.8) {
        const revenueDropPercent = Math.abs(((netRevenue - prevNetRevenue) / prevNetRevenue) * 100);
        const criticalAlert = `Critical revenue drop: Net revenue is down ${revenueDropPercent.toFixed(0)}% from last week.`;
        const messageBuffer = Buffer.from(criticalAlert, 'utf8');
        await pubsub.topic('sms-alerts').publish(messageBuffer);
    }

    // ---------- 3. Blog Stats ----------
    const blogsSnap = await db.collection("blogs")
      .where("publishedAt", ">=", oneWeekAgo)
      .get();

    const blogViewsSnap = await db.collection("blogViews")
      .where("createdAt", ">=", oneWeekAgo)
      .get();

    const newBlogs = blogsSnap.size;
    const blogViews = blogViewsSnap.size;

    // ---------- 4. User Growth ----------
    const usersSnap = await db.collection("users")
      .where("createdAt", ">=", oneWeekAgo)
      .get();

    const newUsers = usersSnap.size;

    // ---------- 5. Demo Analytics ----------
    const demoEntriesSnap = await db.collection("demoAnalytics")
      .where("createdAt", ">=", oneWeekAgo)
      .get();

    const renterVisits = demoEntriesSnap.docs.filter(d => d.data().event === "demo_renter_report_viewed").length;
    const companyVisits = demoEntriesSnap.docs.filter(d => d.data().event === "demo_company_dashboard_viewed").length;

    const conversionsSnap = await db
      .collection("demoAnalytics")
      .where("event", "==", "demo_conversion")
      .where("createdAt", ">=", oneWeekAgo)
      .where("createdAt", "<=", now)
      .get();

    let renterConversions = 0;
    let companyConversions = 0;
    conversionsSnap.forEach((doc) => {
      const data = doc.data().data || {};
      if (data.source === "RENTER") renterConversions++;
      if (data.source === "COMPANY") companyConversions++;
    });

    const renterTrialSnap = await db
      .collection("users")
      .where("plan", "==", "RENTER_TRIAL")
      .where("createdAt", ">=", oneWeekAgo)
      .where("createdAt", "<=", now)
      .get();
    const renterTrials = renterTrialSnap.size;

    const companyTrialSnap = await db
      .collection("users")
      .where("plan", "==", "COMPANY_TRIAL")
      .where("createdAt", ">=", oneWeekAgo)
      .where("createdAt", "<=", now)
      .get();
    const companyTrials = companyTrialSnap.size;

    const paidSnap = await db
      .collection("users")
      .where("demoConversion", "==", true)
      .where("subscription.status", "==", "active")
      .where("createdAt", ">=", oneWeekAgo)
      .where("createdAt", "<=", now)
      .get();

    const renterPaids = paidSnap.docs.filter(d => d.data().source === "RENTER").length;
    const companyPaids = paidSnap.docs.filter(d => d.data().source === "COMPANY").length;

    // ---------- Format Summary ----------
    const summary = `
📊 RentFAX Weekly Digest

Weekly RentFAX Demo Summary:

👤 Renters
- Demo Entries: ${renterVisits}
- Conversions: ${renterConversions} (${calcPercent(renterConversions, renterVisits)})
- Trials Started: ${renterTrials} (${calcPercent(renterTrials, renterConversions)} of conversions)
- Paid Upgrades: ${renterPaids} (${calcPercent(renterPaids, renterTrials)} of trials)

🏢 Companies
- Demo Entries: ${companyVisits}
- Conversions: ${companyConversions} (${calcPercent(companyConversions, companyVisits)})
- Trials Started: ${companyTrials} (${calcPercent(companyTrials, companyConversions)} of conversions)
- Paid Upgrades: ${companyPaids} (${calcPercent(companyPaids, companyTrials)} of trials)

Ops Health:
- Unresolved Disputes: ${unresolved}
- Overdue Disputes (SLA > 7 days): ${overdue}
- Active Fraud Alerts: ${fraudSnap.size}
- Open Chats: ${chatSnap.size}

Business Metrics:
- New Revenue: $${(newRevenue/100).toFixed(2)}
- Churned: $${(churned/100).toFixed(2)}
- Net Revenue: $${(netRevenue/100).toFixed(2)} (Last week: $${(prevNetRevenue/100).toFixed(2)})

Content:
- New Blog Posts: ${newBlogs}
- Blog Views: ${blogViews}

Users:
- New Signups: ${newUsers}

Visit your Super Admin Dashboard for detailed logs.
`;

    // ---------- Send Email ----------
    await transporter.sendMail({
      from: `"RentFAX Weekly Digest" <${process.env.NOTIFY_EMAIL}>`,
      to: DIGEST_EMAIL,
      subject: "📊 RentFAX Weekly Digest",
      text: summary,
    });

    // ---------- Send Slack ----------
    if (SLACK_WEBHOOK_URL) {
      await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      });
    }

    console.log("✅ Weekly digest sent");
    return null;
  });

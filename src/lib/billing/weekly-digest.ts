import { adminDb } from "@/firebase/server";
import { generatePlanRecommendation } from "./recommend";
import { PLAN_LIMITS } from "./limits";
import { sendUsageAlertEmail } from "./email"; // Using the same email sender

// Placeholder for a graph generation service
function generateUsageGraph(usage: any, limits: any): string {
  // In a real app, you'd use a library like Chart.js on the server or a service like ChartURL
  // to generate an image of a bar chart. For now, we return a simple text representation.
  let graphText = "\n";
  for (const event in usage) {
    const used = usage[event];
    const limit = limits[event] || Infinity;
    const percentage = limit === Infinity ? 0 : Math.floor((used / limit) * 100);
    graphText += `${event}: [${'#'.repeat(percentage / 5)}${'-'.repeat(20 - percentage / 5)}] ${percentage}%\n`;
  }
  return graphText;
}

async function sendDigestEmail(to: string, subject: string, body: string) {
  console.log(`
    --- SENDING WEEKLY DIGEST ---
    TO: ${to}
    SUBJECT: ${subject}
    BODY: ${body}
    --------------------------
  `);
  return Promise.resolve();
}


export async function sendWeeklyDigest() {
  const companiesSnap = await adminDb.collection("companies").get();

  for (const companyDoc of companiesSnap.docs) {
    const companyId = companyDoc.id;
    const company = companyDoc.data();
    const plan = company.subscription?.plan || "free";
    const limits = PLAN_LIMITS[plan];

    const usageSnap = await adminDb
      .collection("companies")
      .doc(companyId)
      .collection("usageSummary")
      .doc("current")
      .get();

    const usage = usageSnap.data() || {};
    const rec = generatePlanRecommendation(plan, usage);
    const graph = generateUsageGraph(usage, limits);

    const usersSnap = await adminDb
      .collection("users")
      .where("companyId", "==", companyId)
      .where("role", "in", ["admin", "owner"])
      .get();

    for (const userDoc of usersSnap.docs) {
      const user = userDoc.data();
      if (!user.email) continue;

      const subject = `Your Weekly RentFAX Usage Digest for ${company.name}`;
      let body = `
        <p>Hello ${user.name || "Admin"},</p>
        <p>Here is your weekly usage summary for ${company.name}:</p>
        <pre>${graph}</pre>
      `;

      if (rec.shouldUpgrade) {
        body += `
          <p><b>Upgrade Recommended:</b></p>
          <ul>
            ${rec.recommendations.map(r => `<li>${r.message}</li>`).join("")}
          </ul>
          <p><a href="https://rentfax.pro/pricing">Upgrade your plan</a> to avoid service interruptions.</p>
        `;
      }

      body += `
        <p>Thank you,</p>
        <p>The RentFAX Team</p>
      `;

      await sendDigestEmail(user.email, subject, body);
    }
  }
}

"use server";

import { adminDb } from "@/firebase/server";
import { openai } from "@/lib/openai";

export async function getReports(filters) {
  const current = await getCurrentUserAndCompany(); // Implemented below
  const { companyId } = current;

  let ref = db
    .collection("companies")
    .doc(companyId)
    .collection("reportActivity");

  if (filters.startDate)
    ref = ref.where("createdAt", ">=", new Date(filters.startDate).getTime());

  if (filters.endDate)
    ref = ref.where("createdAt", "<=", new Date(filters.endDate).getTime());

  const snap = await ref.orderBy("createdAt", "desc").limit(500).get();

  let reports = [];
  snap.forEach((doc) => reports.push(doc.data()));

  // Filter by risk
  if (filters.risk) {
    reports = reports.filter((r) => {
      if (filters.risk === "low") return r.riskScore <= 33;
      if (filters.risk === "medium") return r.riskScore > 33 && r.riskScore <= 66;
      if (filters.risk === "high") return r.riskScore > 66;
    });
  }

  // fraud filter
  if (filters.fraud) {
    const hasFraud = filters.fraud === "1";
    reports = reports.filter((r) => (r.fraudCount > 0) === hasFraud);
  }

  // unpaid balances
  if (filters.unpaid) {
    const hasUnpaid = filters.unpaid === "1";
    reports = reports.filter((r) => (r.unpaidBalanceCount > 0) === hasUnpaid);
  }

  // AI Summary
  const aiSummary = await generatePortfolioSummary(reports);

  return { reports, aiSummary };
}

async function getCurrentUserAndCompany() {
  const { getServerUser } = await import("@/lib/auth-server");
  const user = await getServerUser();
  const u = (await db.collection("users").doc(user.uid).get()).data();
  return u;
}

async function generatePortfolioSummary(reports) {
  if (!reports.length) return "No reports available.";

  const text = `
  Summarize renter portfolio risk:

  Data: ${JSON.stringify(
    reports.map((r) => ({
      risk: r.riskScore,
      fraud: r.fraudCount,
      unpaid: r.unpaidBalanceCount,
      type: r.type,
    }))
  )}

  Return a clear summary with:
  - Overall risk trend
  - High-risk segments
  - Fraud patterns
  - Suggested actions
  `;

  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: text }],
  });

  return result.choices[0].message.content;
}

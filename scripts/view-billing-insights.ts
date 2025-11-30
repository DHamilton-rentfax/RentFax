/**
 * RentFAX AI Billing Insights Viewer (with AI Trend Summary)
 * ----------------------------------------------------------
 * Run with:
 *   npx ts-node scripts/view-billing-insights.ts --live --plan=Pro
 */

import "dotenv/config";
import admin from "firebase-admin";
import chalk from "chalk";
import { table } from "table";
import OpenAI from "openai";
import fs from "fs";

// --- Config ---
const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, "").split("=");
    return [key, value ?? true];
  })
);

const PLAN_FILTER = args.plan ? args.plan.toLowerCase() : null;
const COMPANY_FILTER = args.company ? args.company.toLowerCase() : null;
const LIVE_MODE = Boolean(args.live);
const EXPORT_FILE = args.export ? String(args.export) : null;

// --- Firebase Init ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
    ),
  });
}
const db = admin.firestore();

// --- AI Init ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractConfidence(text: string): number | null {
  const match = text.match(/(\d{1,3})%/);
  const val = match ? parseInt(match[1], 10) : null;
  return val && val <= 100 ? val : null;
}

function colorByConfidence(conf: number | null, text: string): string {
  if (conf == null) return chalk.white(text);
  if (conf < 60) return chalk.red(text);
  if (conf < 80) return chalk.yellow(text);
  return chalk.green(text);
}

async function generateSummary(docs: any[]): Promise<string> {
  try {
    const insights = docs.map((d) => d.insight).join("\n");
    const avgConfidence = Math.round(
      docs
        .map((d) => extractConfidence(d.insight) || 0)
        .reduce((a, b) => a + b, 0) / docs.length
    );

    const prompt = `
You are an analyst summarizing SaaS billing insights for RentFAX.
Summarize the following insights into 2-3 clear sentences that would help an investor understand overall trends.
Each insight line represents one company.

Insights:
${insights}

Include mentions of:
- How many companies are overspending or underutilizing add-ons
- How many should upgrade/downgrade
- The most common plan type
- The average confidence level (${avgConfidence}%)
Respond in a professional tone, no more than 3 sentences.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content?.trim() || "No summary generated.";
  } catch (err) {
    console.error(chalk.red("❌ AI summary generation failed:"), err);
    return "Summary unavailable (AI error).";
  }
}

async function fetchAndRenderInsights() {
  const snapshot = await db
    .collection("billing_insights")
    .orderBy("updatedAt", "desc")
    .limit(50)
    .get();

  let docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (PLAN_FILTER)
    docs = docs.filter(
      (d) => (d.currentPlan || "").toLowerCase() === PLAN_FILTER
    );

  if (COMPANY_FILTER)
    docs = docs.filter((d) =>
      (d.companyName || "").toLowerCase().includes(COMPANY_FILTER)
    );

  if (docs.length === 0) {
    console.log(chalk.yellow("⚠️  No insights available."));
    return;
  }

  // --- Generate AI Trend Summary ---
  console.clear();
  console.log(chalk.cyan.bold("\n📊 RentFAX AI Billing Insights Viewer\n"));
  const summary = await generateSummary(docs);
  console.log(chalk.greenBright(`💡 AI Summary:\n${summary}\n`));

  // --- Build table ---
  const rows = [
    [
      chalk.bold("Company"),
      chalk.bold("Plan"),
      chalk.bold("Insight"),
      chalk.bold("Confidence"),
      chalk.bold("Updated At"),
    ],
  ];

  const csvRows: string[] = ["Company,Plan,Insight,Confidence,Updated At"];

  for (const data of docs) {
    const conf = extractConfidence(data.insight);
    const shortInsight =
      data.insight.length > 80
        ? data.insight.substring(0, 77) + "..."
        : data.insight;

    rows.push([
      chalk.cyan(data.companyName || "Unknown"),
      chalk.blueBright(data.currentPlan || "—"),
      chalk.white(shortInsight),
      colorByConfidence(conf, conf ? `${conf}%` : "—"),
      new Date(data.updatedAt?._seconds * 1000 || Date.now()).toLocaleString(),
    ]);

    csvRows.push(
      `"${data.companyName || ""}","${data.currentPlan || ""}","${data.insight.replace(
        /"/g,
        '""'
      )}","${conf || ""}","${new Date(
        data.updatedAt?._seconds * 1000 || Date.now()
      ).toISOString()}"`
    );
  }

  console.log(table(rows));

  if (EXPORT_FILE) {
    fs.writeFileSync(EXPORT_FILE, csvRows.join("\n"));
    console.log(chalk.green(`✅ Exported ${docs.length} insights to ${EXPORT_FILE}\n`));
  }

  if (LIVE_MODE) {
    console.log(chalk.gray("🔄 Refreshing every 10 seconds...\n"));
    setTimeout(fetchAndRenderInsights, 10000);
  }
}

fetchAndRenderInsights();

import { onSchedule, ScheduledEvent } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import OpenAI from "openai";
import { defineSecret } from "firebase-functions/params";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const openaiApiKey = defineSecret("OPENAI_API_KEY");

// ⏰ Runs every 24 hours at midnight UTC
export const aiBillingOptimizer = onSchedule(
  {
    schedule: "every 24 hours",
    timeZone: "UTC",
    secrets: [openaiApiKey],
  },
  async (event: ScheduledEvent) => {
    const openai = new OpenAI({
      apiKey: openaiApiKey.value(),
    });

    const usersSnap = await db.collection("users").get();

    console.log(`🔍 Found ${usersSnap.size} users — starting optimization...`);

    const promises = usersSnap.docs.map(async (userDoc) => {
      try {
        const userId = userDoc.id;
        const usageDoc = await db.collection("usage").doc(userId).get();
        const planDoc = await db.collection("billing").doc(userId).get();

        const usage = usageDoc.data() || {};
        const plan = planDoc.data() || {};

        const reportCount = usage.totalReports || 0;
        const aiReports = usage.aiReports || 0;
        const currentPlan = plan.plan || "Free";
        const addOns = plan.addOns || [];

        const prompt = `
You are an AI billing analyst for RentFAX, a rental intelligence SaaS.
Given this user\'s data, generate 3 short insights on how they can optimize billing.

User:
- Current Plan: ${currentPlan}
- Reports Run: ${reportCount}
- AI Reports: ${aiReports}
- Add-ons: ${addOns.join(", ")}

Each insight should be 1 sentence long and categorized as upgrade, savings, or addon.
`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: prompt }],
          temperature: 0.7,
        });

        const text = completion.choices[0].message?.content || "";
        const insights = text
          .split(/\n+/)
          .filter((line) => line.trim())
          .slice(0, 3)
          .map((line) => ({
            title: line.replace(/^\d+[\).]/, "").trim(),
            type: line.toLowerCase().includes("upgrade")
              ? "upgrade"
              : line.toLowerCase().includes("save")
              ? "savings"
              : "addon",
          }));

        await db.collection("billingInsights").doc(userId).set({
          insights,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`✅ Updated billing insights for ${userId}`);
      } catch (err: any) {
        console.error(`❌ Failed for ${userDoc.id}:`, err.message);
      }
    });

    await Promise.all(promises);
    console.log("🎉 All billing insights refreshed successfully!");
  }
);

// scripts/mockStripeEvents.ts
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
}
const db = admin.firestore();

async function runMockEvents() {
  const billingSnapshot = await db.collection("billing").where("demo", "==", true).get();
  if (billingSnapshot.empty) {
    console.log("No demo billing docs found. Run seedDemoStripeData first.");
    process.exit(0);
  }

  for (const doc of billingSnapshot.docs) {
    const data = doc.data();
    const companyId = doc.id;

    // Example: randomly upgrade or cancel one company
    const rand = Math.random();
    if (rand < 0.4) {
      // upgrade
      const newPlan = data.plan.includes("Starter") ? data.plan.replace("Starter", "Pro") : data.plan;
      await db.collection("billing").doc(companyId).update({
        plan: newPlan,
        status: "active",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await db.collection("auditLogs").add({
        action: "DEMO_SUBSCRIPTION_UPGRADED",
        performedBy: "demo-system",
        role: "SYSTEM",
        targetId: companyId,
        metadata: { from: data.plan, to: newPlan },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Upgraded ${data.companyName} -> ${newPlan}`);
    } else if (rand < 0.6) {
      // cancel
      await db.collection("billing").doc(companyId).update({
        status: "canceled",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await db.collection("auditLogs").add({
        action: "DEMO_SUBSCRIPTION_CANCELED",
        performedBy: "demo-system",
        role: "SYSTEM",
        targetId: companyId,
        metadata: {},
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Canceled ${data.companyName}`);
    } else {
      // invoice paid
      await db.collection("auditLogs").add({
        action: "DEMO_INVOICE_PAID",
        performedBy: "demo-system",
        role: "SYSTEM",
        targetId: companyId,
        metadata: { amount: data.monthlyRevenue || 0 },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Invoice paid for ${data.companyName}`);
    }
  }

  console.log("✅ Mock events emitted.");
  process.exit(0);
}

runMockEvents().catch((err) => {
  console.error(err);
  process.exit(1);
});

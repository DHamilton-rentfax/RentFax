// scripts/seedDemoStripeData.ts
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}
const db = admin.firestore();

async function seedDemoData() {
  const adminEmail = "info@rentfax.io";
  const companies = [
    { name: "Acme Rentals", plan: "Pro Monthly", monthlyRevenue: 299 },
    { name: "Horizon Realty", plan: "Starter Monthly", monthlyRevenue: 99 },
    { name: "BrightStay Homes", plan: "Pro Monthly", monthlyRevenue: 299 },
    { name: "Sunset Properties", plan: "Enterprise", monthlyRevenue: 899 },
  ];

  for (const c of companies) {
    const compRef = db.collection("companies").doc();
    await compRef.set({
      name: c.name,
      createdBy: adminEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      demo: true,
    });

    // billing doc keyed by company id (demo)
    await db.collection("billing").doc(compRef.id).set({
      companyId: compRef.id,
      companyName: c.name,
      plan: c.plan,
      status: "active",
      monthlyRevenue: c.monthlyRevenue,
      demo: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // audit log
    await db.collection("auditLogs").add({
      action: "DEMO_COMPANY_ADDED",
      performedBy: adminEmail,
      role: "SUPER_ADMIN",
      targetId: compRef.id,
      metadata: { name: c.name, plan: c.plan },
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Seeded: ${c.name} (${c.plan})`);
  }

  // Global demo analytics doc (optional)
  await db.collection("analytics").doc("demoMetrics").set({
    totalCustomers: companies.length,
    mrr: companies.reduce((s, c) => s + c.monthlyRevenue, 0),
    activeSubscriptions: companies.length,
    churnRate: 0.03,
    demo: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("✅ Demo data seeded successfully.");
  process.exit(0);
}

seedDemoData().catch((err) => {
  console.error(err);
  process.exit(1);
});

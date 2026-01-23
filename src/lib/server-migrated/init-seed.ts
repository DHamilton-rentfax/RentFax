import { adminDb } from "@/firebase/server";
import { FieldValue } from "@/firebase/server/firestore";

/**
 * =================================================================
 *  RENTFAX DATABASE SEED SCRIPT
 * =================================================================
 *
 *  Description:
 *  This script populates the Firestore database with the initial data required for RentFAX to run correctly.
 *  It includes plans, pricing tiers, default compliance broadcasts, and an admin welcome message.
 *
 *  - Plans & Pricing: Defines the subscription tiers (Free, Starter, Pro, Enterprise).
 *  - Compliance Broadcasts: Pre-loads templates for legal/regulatory alerts.
 *  - Admin Messages: Sets up initial notifications or messages for system administrators.
 *
 *  -----------------------------------------------------------------
 *  **TO RUN THIS SCRIPT:**
 *  1. Ensure your Firebase Admin SDK credentials are configured in your environment
 *     (e.g., by setting the GOOGLE_APPLICATION_CREDENTIALS environment variable).
 *  2. Execute from the project root:
 *     `npx ts-node src/scripts/init-seed.ts`
 *  -----------------------------------------------------------------
 *
 *  **WARNING:**
 *  This script is intended for one-time use on a fresh project.
 *  Running it on an existing database may create duplicate or conflicting entries.
 *
 */

const db = adminDb;

// --- 1. SEED PLANS AND PRICING TIERS ---
const seedPlans = async () => {
  console.log("\n🌱 Seeding Plans and Pricing Tiers...");
  const plansCollection = db.collection("plans");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      description: "For individuals and small landlords starting out.",
      features: ["Basic Renter Screening", "5 Manual Verifications/mo"],
      rank: 0,
    },
    {
      id: "starter",
      name: "Starter",
      price: 49,
      description: "For growing property managers who need more power.",
      features: ["All Free features", "QR Analytics", "25 Verifications/mo"],
      stripePriceId: "price_starter_monthly",
      rank: 1,
    },
    {
      id: "pro",
      name: "Pro",
      price: 99,
      description: "Unlock premium features for advanced fraud detection.",
      features: ["All Starter features", "AI Insights", "Fraud Scanner", "100 Verifications/mo"],
      stripePriceId: "price_pro_monthly",
      rank: 2,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: null, // Custom pricing
      description: "For large-scale operations requiring unlimited access and support.",
      features: ["All Pro features", "Unlimited Verifications", "Priority Support", "Custom Integrations"],
      stripePriceId: null,
      rank: 3,
    },
  ];

  const batch = db.batch();
  plans.forEach((plan) => {
    const docRef = plansCollection.doc(plan.id);
    batch.set(docRef, plan);
  });

  await batch.commit();
  console.log("✨ Plans seeded successfully.");
};

// --- 2. SEED DEFAULT COMPLIANCE BROADCASTS ---
const seedComplianceBroadcasts = async () => {
  console.log("\n🌱 Seeding Default Compliance Broadcasts...");
  const broadcastsCollection = db.collection("compliance_broadcasts");

  const broadcasts = [
    {
      title: "Fair Housing Act Update (Q4)",
      content: "Reminder: New guidelines regarding tenant screening and non-discrimination policies under the Fair Housing Act are now in effect. Please review your internal procedures.",
      audience: ["agency", "legal"],
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      title: "Data Privacy & GDPR Compliance",
      content: "All partners must ensure their data handling processes are fully compliant with GDPR and CCPA regulations. Encrypt all tenant personally identifiable information (PII).",
      audience: ["agency", "admin"],
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
    },
  ];

  const batch = db.batch();
  broadcasts.forEach((broadcast) => {
    const docRef = broadcastsCollection.doc();
    batch.set(docRef, broadcast);
  });

  await batch.commit();
  console.log("✨ Compliance broadcasts seeded successfully.");
};


// --- 3. SEED ADMIN WELCOME MESSAGE ---
const seedAdminWelcome = async () => {
    console.log("\n🌱 Seeding Admin Welcome Message...");
    const settingsCollection = db.collection("site_settings");
    await settingsCollection.doc("admin_dashboard").set({
        welcomeMessage: {
            title: "Welcome to RentFAX, Admin!",
            content: "This is your central command for overseeing all platform activity. You can manage users, monitor system health, and broadcast important compliance alerts from here.",
            cta: "View System Status",
            link: "/admin/status"
        }
    });
    console.log("✨ Admin welcome message seeded successfully.");
}


// --- MAIN EXECUTION ---
const main = async () => {
  console.log("========================================");
  console.log("🚀 STARTING RENTFAX DATABASE SEEDING...");
  console.log("========================================");

  try {
    await seedPlans();
    await seedComplianceBroadcasts();
    await seedAdminWelcome();
    console.log("\n\n========================================");
    console.log("🎉 DATABASE SEEDING COMPLETE! 🎉");
    console.log("========================================");
    process.exit(0);
  } catch (error) {
    console.error("\n\n========================================");
    console.error("❌ An error occurred during database seeding:");
    console.error(error);
    console.error("========================================");
    process.exit(1);
  }
};

main();

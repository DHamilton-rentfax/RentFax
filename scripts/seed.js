import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../service-account.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function seed() {
  console.log("🌱 Seeding RentFAX…");

  // Demo company
  const companyId = "demo-company";
  await db.collection("companies").doc(companyId).set({
    name: "Demo Rentals Inc.",
    createdAt: Date.now(),
    onboarding: { step: 3, completed: true }
  });

  // Demo landlord user
  await db.collection("users").doc("landlord-demo").set({
    email: "demo@rentfax.io",
    role: "LANDLORD",
    companyId,
    onboardingCompleted: true
  });

  // Default incident types
  const types = ["Late Payment", "Vehicle Damage", "Smoking", "Cleanliness", "Unreturned Equipment"];
  for (const type of types) {
    await db.collection("incidentTypes").add({ name: type });
  }

  // 3 Demo renters + reports
  for (let i = 1; i <= 3; i++) {
    const renterId = `demo-renter-${i}`;
    const reportId = `demo-report-${i}`;

    await db.collection("renters").doc(renterId).set({
      fullName: `Demo Renter ${i}`,
      email: `renter${i}@example.com`,
      createdAt: Date.now(),
    });

    await db.collection("reports").doc(reportId).set({
      renterId,
      createdAt: Date.now(),
      unlocked: true,
      riskScore: Math.floor(Math.random() * 100),
      confidenceScore: Math.floor(Math.random() * 100),
      incidents: [
        {
          type: "Late Payment",
          amount: 125,
          createdAt: Date.now(),
          status: "paid"
        }
      ]
    });
  }

  console.log("🌱 Seed complete.");
  process.exit();
}

seed();
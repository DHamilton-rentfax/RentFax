/**
 * RentFAX Seed Script
 * Run: npx ts-node scripts/seed.ts
 */

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../service-account.json"; // You must create/download this file

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore();

async function seed() {
  console.log("🌱 Seeding RentFAX demo environment...");

  /* ----------------------------------------------------------- */
  /* DEMO COMPANIES                                              */
  /* ----------------------------------------------------------- */
  const companies = [
    {
      name: "Prime Auto Rentals",
      industry: "Car Rental",
      address: "123 Demo Drive, Austin, TX",
      onboardingCompleted: true,
      createdAt: Date.now(),
    },
    {
      name: "Sunrise Living Apartments",
      industry: "Property Management",
      address: "500 Sunset Avenue, Los Angeles, CA",
      onboardingCompleted: true,
      createdAt: Date.now(),
    },
  ];

  const companyRefs: any[] = [];

  for (const company of companies) {
    const ref = await db.collection("companies").add(company);
    companyRefs.push(ref);
  }

  console.log("🏢 Seeded companies.");

  /* ----------------------------------------------------------- */
  /* DEMO RENTERS                                                */
  /* ----------------------------------------------------------- */
  const renters = [
    {
      fullName: "Michael Turner",
      email: "mike.turner@example.com",
      phone: "(555) 112-9933",
      address: "10 River Road, Dallas, TX",
      licenseNumber: "TX990201",
      riskScore: 74,
      confidenceScore: 81,
      behaviorScore: 60,
    },
    {
      fullName: "Jasmine Patel",
      email: "jasmine.patel@example.com",
      phone: "(555) 771-8844",
      address: "88 Market Street, San Diego, CA",
      licenseNumber: "CA887620",
      riskScore: 91,
      confidenceScore: 96,
      behaviorScore: 85,
    },
  ];

  const renterRefs: any[] = [];
  for (const renter of renters) {
    const ref = await db.collection("renters").add({
      ...renter,
      createdAt: Date.now(),
    });
    renterRefs.push(ref);
  }

  console.log("🧍 Seeded demo renters.");

  /* ----------------------------------------------------------- */
  /* DEMO INCIDENTS                                              */
  /* ----------------------------------------------------------- */
  const incidents = [
    {
      renterId: renterRefs[0].id,
      companyId: companyRefs[0].id,
      type: "Vehicle Damage",
      description:
        "Front bumper damage and scratches along the passenger side.",
      amountOwed: 582.44,
      status: "unresolved",
      createdAt: Date.now(),
    },
    {
      renterId: renterRefs[1].id,
      companyId: companyRefs[1].id,
      type: "Late Rent Payment",
      description:
        "Renter was late 3 consecutive months in 2023.",
      amountOwed: 0,
      status: "resolved",
      createdAt: Date.now(),
    },
  ];

  const incidentRefs: any[] = [];
  for (const incident of incidents) {
    const ref = await db.collection("incidents").add(incident);
    incidentRefs.push(ref);
  }

  console.log("⚠️ Seeded incidents.");

  /* ----------------------------------------------------------- */
  /* DEMO REPORTS (CarFax-style)                                 */
  /* ----------------------------------------------------------- */
  for (let i = 0; i < renterRefs.length; i++) {
    await db.collection("reports").add({
      renterId: renterRefs[i].id,
      incidents: [incidentRefs[i].id],
      generatedAt: Date.now(),
      aiSummary:
        "Renter exhibits moderate risk. Payment patterns are stable, but there is one recorded incident requiring review.",
      risk: {
        score: renters[i].riskScore,
        confidenceScore: renters[i].confidenceScore,
        behaviorScore: renters[i].behaviorScore,
      },
    });
  }

  console.log("📘 Seeded demo reports.");

  console.log("🌱 DONE — Demo data created successfully.");
}

seed().catch((err) => console.error(err));
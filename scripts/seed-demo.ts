// scripts/seed-demo.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(app);

const RENTAL_TYPES = ["Home", "Car", "Equipment"];
const STATUSES = ["Good", "Moderate", "High Risk", "Banned"];
const COMPANIES = ["DriveNow Rentals", "UrbanStay", "EZEquip", "MetroHomes", "RideLine"];
const LOCATIONS = ["Atlanta, GA", "Miami, FL", "Dallas, TX", "Chicago, IL", "Los Angeles, CA"];

const randomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const randomScore = () => Math.floor(Math.random() * 101);

function generateRenterReports() {
  const renters = [];
  for (let i = 1; i <= 20; i++) {
    const id = `RFX-${i.toString().padStart(3, "0")}`;
    const score = randomScore();
    const status =
      score > 80 ? "Good" : score > 60 ? "Moderate" : score > 40 ? "High Risk" : "Banned";

    const historyCount = Math.floor(Math.random() * 5) + 2;
    const rentalHistory = Array.from({ length: historyCount }).map((_, idx) => ({
      rentalId: `${id}-HIST-${idx + 1}`,
      type: randomItem(RENTAL_TYPES),
      company: randomItem(COMPANIES),
      location: randomItem(LOCATIONS),
      startDate: new Date(Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      paymentStatus: Math.random() > 0.85 ? "Unpaid Balance" : "Paid",
      incident: Math.random() > 0.9 ? "Accident" : Math.random() > 0.95 ? "Damage Claim" : "None",
      rating: Math.floor(Math.random() * 5) + 1,
    }));

    renters.push({
      reportId: id,
      renterName: `Renter ${i}`,
      email: `renter${i}@demo.io`,
      phone: `555-01${i.toString().padStart(2, "0")}`,
      score,
      status,
      totalRentals: historyCount,
      rentalHistory,
      openBalances: rentalHistory.filter((r) => r.paymentStatus === "Unpaid Balance").length,
      bannedFrom:
        status === "Banned"
          ? [randomItem(COMPANIES), randomItem(COMPANIES)].filter(
              (v, i, arr) => arr.indexOf(v) === i
            )
          : [],
      createdAt: new Date(),
    });
  }
  return renters;
}

function generateAnalytics(renters: any[]) {
  const avgScore =
    renters.reduce((sum, r) => sum + r.score, 0) / renters.length;
  const fraudCount = renters.filter((r) => r.status === "High Risk" || r.status === "Banned").length;
  const disputeRate = Math.random() * 3; // random 0-3%

  return {
    reportsGenerated: renters.length,
    avgFraudScore: Math.round(avgScore),
    fraudCount,
    disputeRate: disputeRate.toFixed(1),
    newRentersScreened: Math.floor(Math.random() * 500),
    trend: Array.from({ length: 6 }).map((_, i) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
      risk: 70 + Math.random() * 15,
    })),
    createdAt: new Date(),
  };
}

function generateTeam() {
  return [
    {
      id: "demo-admin",
      name: "Dominique (Admin)",
      email: "admin@rentfax.io",
      role: "Admin",
      joinedAt: new Date(),
    },
    {
      id: "demo-analyst",
      name: "Alex Johnson",
      email: "alex@rentfax.io",
      role: "Analyst",
      joinedAt: new Date(),
    },
    {
      id: "demo-agent",
      name: "Taylor Smith",
      email: "taylor@rentfax.io",
      role: "Agent",
      joinedAt: new Date(),
    },
  ];
}

async function seedDemo() {
  console.log("🌱 Starting RentFAX Demo Seeder...");

  const renters = generateRenterReports();
  const analytics = generateAnalytics(renters);
  const team = generateTeam();

  const batch = db.batch();

  // --- Write renters ---
  renters.forEach((r) => {
    const ref = db.collection("demo_renters").doc(r.reportId);
    batch.set(ref, r);
  });

  // --- Write analytics ---
  const analyticsRef = db.collection("demo_analytics").doc("summary");
  batch.set(analyticsRef, analytics);

  // --- Write team ---
  team.forEach((t) => {
    const ref = db.collection("demo_team").doc(t.id);
    batch.set(ref, t);
  });

  await batch.commit();

  console.log("✅ Demo renters, analytics, and team seeded successfully!");
  console.log("👥 Renters:", renters.length);
  console.log("📊 Avg Score:", analytics.avgFraudScore);
}

seedDemo().catch((err) => {
  console.error("❌ Seeder failed:", err);
  process.exit(1);
});
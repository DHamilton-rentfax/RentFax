// ===========================================
// RentFAX | Firestore Schema Initialization
// Location: /scripts/initFirestoreSchema.ts
// ===========================================

import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// Initialize Firebase Admin
initializeApp({
  credential: applicationDefault(), // or cert(require("../serviceAccountKey.json"))
});

const db = getFirestore();

async function initSchema() {
  console.log("🔧 Initializing Firestore schema for RentFAX...");

  // ---- USERS COLLECTION ----
  const exampleUserRef = db.collection("users").doc("exampleUser");
  await exampleUserRef.set({
    name: "Demo User",
    email: "demo@rentfax.io",
    planType: "free", // free | pro50 | pro300 | enterprise
    remainingCredits: 0,
    subscriptionActive: false,
    stripeCustomerId: "",
    role: "USER", // USER | ADMIN | SUPER_ADMIN
    createdAt: Timestamp.now(),
    lastCreditReset: Timestamp.now(),
  });

  // ---- RENTER PROFILES ----
  const renterProfilesRef = db.collection("renterProfiles").doc("_schema");
  await renterProfilesRef.set({
    createdAt: Timestamp.now(),
    note: "Structure: { name, emails[], phones[], address, licenseHash, riskScore }",
  });

  // ---- RENTER REPORTS ----
  const renterReportsRef = db.collection("renterReports").doc("_schema");
  await renterReportsRef.set({
    createdAt: Timestamp.now(),
    note: "Structure: { renterRef, createdBy, type, status, results }",
  });

  // ---- SEARCH LOGS ----
  const searchLogsRef = db.collection("searchLogs").doc("_schema");
  await searchLogsRef.set({
    createdAt: Timestamp.now(),
    note: "Structure: { userId, renterRef, renterName, timestamp, result, usedCredit }",
  });

  console.log("✅ Firestore schema initialized successfully!");
}

initSchema().catch((err) => {
  console.error("❌ Schema initialization failed:", err);
});

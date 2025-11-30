"use server";

import { adminDB } from "@/firebase/server-admin";
import { Timestamp } from "firebase-admin/firestore";
import JaroWinkler from "jaro-winkler-typescript";

// ------------------------------
// 🔥 Access Control
// ------------------------------
async function assertAdmin() {
  const { currentUser } = await import("@/utils/auth-server");
  const user = await currentUser();

  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  return user;
}

// Utility: Normalize email for matching
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

// ------------------------------
// 🔥 GET FRAUD SUMMARY
// ------------------------------
export async function getFraudSummary(renterId: string) {
  await assertAdmin();

  const ref = adminDB
    .collection("renters")
    .doc(renterId)
    .collection("fraud_signals")
    .doc("summary");

  const snap = await ref.get();
  if (!snap.exists) {
    return { score: 0, alert: false, signals: [] };
  }

  return snap.data();
}

// ------------------------------
// 🔥 DUPLICATE PROFILE DETECTION
// ------------------------------
async function detectDuplicateProfiles(renter: any) {
  const email = normalizeEmail(renter.email);

  const snapshot = await adminDB
    .collection("renters")
    .where("email", "==", email)
    .get();

  const duplicates = snapshot.docs
    .filter((doc) => doc.id !== renter.id)
    .map((doc) => doc.id);

  return duplicates.length > 0
    ? {
        type: "duplicate_email",
        confidence: 0.95,
        explanation: `Email also appears on ${duplicates.length} other profile(s).`,
        related: duplicates,
      }
    : null;
}

// ------------------------------
// 🔥 EMAIL SIMILARITY DETECTION
// (Detects emails like john.doe vs john_doe vs john-doe)
// ------------------------------
async function detectEmailSimilarity(renter: any) {
  const rentersSnap = await adminDB.collection("renters").get();

  const signals = [];
  const currentEmail = normalizeEmail(renter.email);

  rentersSnap.forEach((doc) => {
    if (doc.id === renter.id) return;

    const otherEmail = normalizeEmail(doc.data().email);
    const similarity = JaroWinkler(currentEmail, otherEmail);

    if (similarity > 0.90) {
      signals.push({
        type: "email_similarity",
        confidence: similarity,
        explanation: `Email is ${Math.round(similarity * 100)}% similar to ${otherEmail}`,
        related: [doc.id],
      });
    }
  });

  return signals;
}

// ------------------------------
// 🔥 PHONE REUSE DETECTION
// ------------------------------
async function detectPhoneReuse(renter: any) {
  const snapshot = await adminDB
    .collection("renters")
    .where("phone", "==", renter.phone)
    .get();

  const related = snapshot.docs
    .filter((doc) => doc.id !== renter.id)
    .map((doc) => doc.id);

  return related.length > 0
    ? {
        type: "phone_reuse",
        confidence: 0.9,
        explanation: `Phone number is used by ${related.length} other profile(s).`,
        related,
      }
    : null;
}

// ------------------------------
// 🔥 VELOCITY DETECTION
// (Detect many accounts created in short time)
// ------------------------------
async function detectVelocity(renter: any) {
  const last24h = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);

  const snapshot = await adminDB
    .collection("renters")
    .where("createdAt", ">=", last24h)
    .get();

  const count = snapshot.size;

  return count > 20
    ? {
        type: "velocity_alert",
        confidence: 0.85,
        explanation: `${count} renter profiles created in the last 24 hours.`,
        related: [],
      }
    : null;
}

// ------------------------------
// 🔥 CROSS-INDUSTRY PATTERN DETECTION
// ------------------------------
async function detectCrossIndustryPatterns(renter: any) {
  const incidents = await adminDB
    .collection("incidents")
    .where("renterId", "==", renter.id)
    .get();

  const industries = new Set();
  incidents.docs.forEach((d) => industries.add(d.data().industry));

  return industries.size >= 3
    ? {
        type: "cross_industry_usage",
        confidence: 0.9,
        explanation: `Renter has activity in ${industries.size} different rental industries.`,
        related: [],
      }
    : null;
}

// ------------------------------
// 🔥 COMBINE + SCORE SIGNALS
// ------------------------------
function calculateRiskScore(signals: any[]) {
  if (signals.length === 0) return 20;

  let score = 20;

  signals.forEach((s) => {
    // weighted scoring system
    switch (s.type) {
      case "duplicate_email":
        score += 40;
        break;
      case "email_similarity":
        score += 20;
        break;
      case "phone_reuse":
        score += 25;
        break;
      case "velocity_alert":
        score += 30;
        break;
      case "cross_industry_usage":
        score += 15;
        break;
    }
  });

  return Math.min(score, 100);
}

// ------------------------------
// 🔥 UPDATE FRAUD SUMMARY (MAIN ENGINE)
// ------------------------------
export async function updateFraudSummary(renterId: string) {
  await assertAdmin();

  const renterDoc = await adminDB.collection("renters").doc(renterId).get();
  if (!renterDoc.exists) throw new Error("Renter not found");

  const renter = { id: renterDoc.id, ...renterDoc.data() };

  const signals: any[] = [];

  // Run all detectors
  const duplicate = await detectDuplicateProfiles(renter);
  if (duplicate) signals.push(duplicate);

  const emailSimilarities = await detectEmailSimilarity(renter);
  signals.push(...emailSimilarities);

  const phoneReuse = await detectPhoneReuse(renter);
  if (phoneReuse) signals.push(phoneReuse);

  const velocity = await detectVelocity(renter);
  if (velocity) signals.push(velocity);

  const crossIndustry = await detectCrossIndustryPatterns(renter);
  if (crossIndustry) signals.push(crossIndustry);

  // Final Score
  const score = calculateRiskScore(signals);
  const alert = score >= 70 || signals.length > 0;

  const summary = {
    score,
    alert,
    signals,
    updatedAt: Timestamp.now(),
  };

  await adminDB
    .collection("renters")
    .doc(renterId)
    .collection("fraud_signals")
    .doc("summary")
    .set(summary);

  return summary;
}
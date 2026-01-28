import { getAdminDb } from "@/firebase/server";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { renterId } = await req.json();
  
  const profileRef = firestoreAdmin.collection("renterProfiles").doc(renterId);
  const profileSnap = await profileRef.get();
  const profile = profileSnap.data();

  const incidents = await firestoreAdmin
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const disputes = await firestoreAdmin
    .collection("disputes")
    .where("renterId", "==", renterId)
    .get();

  let penalty = 0;
  let bonus = 0;

  // INCIDENTS
  incidents.forEach((d) => {
    const inc = d.data();
    const weightMap = {
      MINOR: 5,
      MEDIUM: 10,
      MAJOR: 20,
      CRITICAL: 35,
    };
    const severity = weightMap[inc.severity] || 0;

    const industryMultiplier = {
      housing: 1.0,
      automotive: 0.8,
      equipment: 1.1,
      vacation: 0.7,
      storage: 0.6,
    }[inc.industry] || 1.0;

    penalty += severity * industryMultiplier;
  });

  // DISPUTES
  disputes.forEach((d) => {
    const dispute = d.data();
    if (dispute.status === "OPEN") penalty += 10;
    if (dispute.status === "AGAINST_RENTER") penalty += 15;
  });

  // FRAUD SIGNALS
  const fs = profile.fraudSignals || [];
  fs.forEach((signal) => {
    const fraudPenaltyMap = {
      DUPLICATE_PHONE: 5,
      DUPLICATE_EMAIL: 5,
      DUPLICATE_ADDRESS: 10,
      MULTIPLE_IDS: 15,
      MULTIPLE_PROFILES: 20,
    };
    penalty += fraudPenaltyMap[signal] || 0;
  });

  // POSITIVE BEHAVIOR
  if (profile.monthsIncidentFree >= 12) bonus += 10;
  if (profile.endorsements >= 1) bonus += 5;

  // FINAL SCORE
  let finalScore = 100 - penalty + bonus;
  if (finalScore < 0) finalScore = 0;
  if (finalScore > 100) finalScore = 100;

  await profileRef.update({
    universalScore: finalScore,
    updatedAt: new Date(),
  });

  return NextResponse.json({ finalScore });
}

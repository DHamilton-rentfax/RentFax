
import { NextResponse } from "next/server";
import { extractTextFromId } from "@/lib/verify/ocr";
import { matchFace } from "@/lib/verify/face";
import { checkLiveness } from "@/lib/verify/liveness";
import { buildShadowIdentityGraph } from "@/lib/fraud/shadow-map";
import { getFraudSignals } from "@/lib/fraud/signals";
import { determineVerificationOutcome } from "@/lib/verify/decision-engine";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { imageFront, imageBack, selfie, renterId } = await req.json();

  const [frontData, backData, faceMatchScore, liveness, shadowGraph, fraudSignals] = await Promise.all([
    extractTextFromId(imageFront),
    extractTextFromId(imageBack),
    matchFace(selfie, imageFront),
    checkLiveness(selfie),
    buildShadowIdentityGraph(renterId),
    getFraudSignals(renterId)
  ]);

  const decision = determineVerificationOutcome({
    frontData,
    backData,
    faceMatchScore,
    liveness,
    shadowGraph,
    fraudSignals
  });

  await adminDb.collection("verifications").doc(renterId).set({
    renterId,
    frontData,
    backData,
    faceMatchScore,
    liveness,
    shadowGraph,
    fraudSignals,
    decision,
    createdAt: new Date()
  });

  await adminDb.collection("renters").doc(renterId).update({
    verificationStatus: decision.outcome,
    verificationFlags: decision.reasons
  });

  return NextResponse.json(decision);
}

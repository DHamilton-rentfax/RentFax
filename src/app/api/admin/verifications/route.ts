import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const pendingVerifications = await adminDb
    .collection("self_verifications")
    .where("status", "==", "pending")
    .get();

  const verifications = pendingVerifications.docs.map(doc => ({
    ...doc.data(),
    reportId: doc.data().reportId, // Ensure reportId is included
    renterName: doc.data().renter.name,
    method: "self-verify"
  }));

  return NextResponse.json(verifications);
}

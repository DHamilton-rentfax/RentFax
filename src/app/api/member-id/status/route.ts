import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/firebase/server";
import { getEffectiveOrgId } from "@/lib/auth/getEffectiveOrgId";
import { Timestamp } from "firebase-admin/firestore";

export async function GET(req: Request) {
  // 1. Authentication & Authorization
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(authHeader.replace("Bearer ", ""));
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const orgId = await getEffectiveOrgId(decoded.uid, decoded.orgId);
  if (!orgId) {
    return NextResponse.json({ error: "Organization context missing" }, { status: 400 });
  }

  // 2. Get renterId from query parameters
  const { searchParams } = new URL(req.url);
  const renterId = searchParams.get("renterId");

  if (!renterId) {
    return NextResponse.json({ error: "renterId is required" }, { status: 400 });
  }

  // 3. Query for the most recent request for the given org and renter
  const snap = await adminDb
    .collection("memberIdRequests")
    .where("orgId", "==", orgId)
    .where("renterId", "==", renterId)
    .orderBy("requestedAt", "desc")
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ status: "NONE" });
  }

  const latestRequest = snap.docs[0].data();
  let status = latestRequest.status;

  // 4. Handle and persist EXPIRED status
  if (status === "PENDING" && latestRequest.expiresAt.toMillis() < Date.now()) {
    status = "EXPIRED";
    await snap.docs[0].ref.update({
      status: "EXPIRED",
      respondedAt: Timestamp.now(),
    });
  }

  // 5. Return the calculated status
  return NextResponse.json({ status });
}

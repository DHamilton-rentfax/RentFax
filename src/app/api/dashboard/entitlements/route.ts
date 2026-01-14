import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { verifySession } from "@/lib/auth/verifySession";

export async function GET() {
  const session = await verifySession();
  if (!session?.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgSnap = await adminDb.collection("orgs").doc(session.orgId).get();
  if (!orgSnap.exists) {
    return NextResponse.json({ error: "Org not found" }, { status: 404 });
  }

  const org = orgSnap.data()!;

  const intentsSnap = await adminDb
    .collection("payment_intents")
    .where("companyId", "==", session.orgId)
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();

  const recentPayments = intentsSnap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));

  return NextResponse.json({
    plan: org.plan,
    status: org.status,
    credits: org.credits,
    limits: org.limits,
    features: org.features,
    seats: org.seats,
    billing: org.billing,
    recentPayments,
  });
}

import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ active: false });

  const decoded = await adminAuth.verifyIdToken(
    authHeader.replace("Bearer ", "")
  );

  const snap = await adminDb
    .collection("adminImpersonationSessions")
    .where("adminId", "==", decoded.uid)
    .where("active", "==", true)
    .limit(1)
    .get();

  if (snap.empty) return NextResponse.json({ active: false });

  const data = snap.docs[0].data();
  if (data.expiresAt.toMillis() < Date.now()) {
    await snap.docs[0].ref.update({ active: false });
    return NextResponse.json({ active: false });
  }

  return NextResponse.json({
    active: true,
    orgId: data.orgId,
    expiresAt: data.expiresAt.toDate().toISOString(),
  });
}

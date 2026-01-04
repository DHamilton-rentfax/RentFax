import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = await adminAuth.verifyIdToken(
    authHeader.replace("Bearer ", "")
  );

  const snap = await adminDb
    .collection("adminImpersonationSessions")
    .where("adminId", "==", decoded.uid)
    .where("active", "==", true)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ success: true });
  }

  await snap.docs[0].ref.update({
    active: false,
    exitedAt: Timestamp.now(),
  });

  return NextResponse.json({ success: true });
}

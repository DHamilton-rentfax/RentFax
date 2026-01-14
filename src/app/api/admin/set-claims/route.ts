import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { uid } = await req.json();
  if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });

  const snap = await adminDb.collection("users").doc(uid).get();
  if (!snap.exists) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const user = snap.data()!;

  await adminAuth.setCustomUserClaims(uid, {
    role: user.role,
    companyId: user.companyId ?? null,
  });

  return NextResponse.json({ success: true });
}

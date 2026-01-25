import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebase-admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Missing token" },
      { status: 400 }
    );
  }

  const snap = await adminDb
    .collection("verification_requests")
    .where("token", "==", token)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ status: "invalid" });
  }

  const data = snap.docs[0].data();

  return NextResponse.json({
    status: data.status,
    updatedAt: data.updatedAt || null,
  });
}

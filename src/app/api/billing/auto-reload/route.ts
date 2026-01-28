import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { userId, enabled, threshold = 5, credits = 10 } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  await adminDb.collection("users").doc(userId).set({
    billingSettings: {
      autoReload: enabled,
      autoReloadThreshold: threshold,
      autoReloadCredits: credits,
    }
  }, { merge: true });

  return NextResponse.json({ success: true });
}

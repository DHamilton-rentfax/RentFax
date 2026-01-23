import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
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

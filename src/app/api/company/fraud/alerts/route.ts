import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  const snap = await adminDb
    .collection("fraudAlerts")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  const alerts = snap.docs.map((d) => d.data());

  return NextResponse.json({ alerts });
}

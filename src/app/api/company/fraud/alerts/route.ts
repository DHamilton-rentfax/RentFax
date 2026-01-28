import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const snap = await adminDb
    .collection("fraudAlerts")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  const alerts = snap.docs.map((d) => d.data());

  return NextResponse.json({ alerts });
}

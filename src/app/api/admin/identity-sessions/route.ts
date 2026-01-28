import { getAdminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const snap = await adminDb
    .collection("identitySessions")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  const sessions = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return NextResponse.json({ sessions });
}

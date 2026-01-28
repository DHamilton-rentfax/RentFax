import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const partnersSnap = await adminDb.collection("partner_orgs").get();
  const partners = partnersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return NextResponse.json({ partners });
}

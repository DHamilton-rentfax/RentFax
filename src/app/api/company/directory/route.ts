import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const snap = await adminDb.collection("companies").get();

  const companies = snap.docs.map(d => ({
    companyId: d.id,
    ...d.data()
  }));

  return NextResponse.json({ companies });
}

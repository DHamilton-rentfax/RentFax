import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  const snap = await adminDb.collection("companies").get();

  const companies = snap.docs.map(d => ({
    companyId: d.id,
    ...d.data()
  }));

  return NextResponse.json({ companies });
}

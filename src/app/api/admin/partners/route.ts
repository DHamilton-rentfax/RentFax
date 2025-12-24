import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  const partnersSnap = await adminDb.collection("partner_orgs").get();
  const partners = partnersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return NextResponse.json({ partners });
}

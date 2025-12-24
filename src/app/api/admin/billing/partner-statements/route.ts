import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  const snap = await adminDb
    .collection("partner_billing_statements")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return NextResponse.json({
    statements: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
  });
}

import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get("companyId");

  if (!companyId) {
    return NextResponse.json({ error: "Missing company ID" }, { status: 400 });
  }

  const doc = await adminDb
    .collection("companyBehaviorMetrics")
    .doc(companyId)
    .get();

  return NextResponse.json({
    metrics: doc.exists ? doc.data() : null,
  });
}

import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" });

  const companyDoc = await adminDb.collection("companies").doc(id).get();
  const metricsDoc = await adminDb
    .collection("companyBehaviorMetrics")
    .doc(id)
    .get();

  return NextResponse.json({
    company: companyDoc.data() || {},
    metrics: metricsDoc.data() || {},
  });
}

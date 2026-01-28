import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const body = await req.json();
    const { orgId, status } = body;

    if (!orgId) {
      return NextResponse.json({ error: "Missing orgId" }, { status: 400 });
    }

    // Example: mark partner org as paid/active
    await adminDb.collection("partners").doc(String(orgId)).set(
      {
        billingStatus: status || "PAID",
        convertedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Partner convert error:", err);
    return NextResponse.json(
      { error: err?.message || "Convert failed" },
      { status: 500 }
    );
  }
}

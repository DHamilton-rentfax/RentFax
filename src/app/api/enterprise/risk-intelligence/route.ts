import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { doc, getDoc } from "firebase/firestore";
import { headers } from "next/headers";

async function validateEnterpriseKey() {
  const key = headers().get("x-enterprise-key");
  if (!key) return null;

  const snap = await getDoc(doc(db, "enterpriseClients", key));
  if (!snap.exists()) return null;

  const data = snap.data();
  if (!data.active) return null;

  return { id: key, ...data };
}

export async function POST(req: Request) {
  try {
    const client = await validateEnterpriseKey();
    if (!client)
      return NextResponse.json(
        { error: "Invalid or inactive enterprise key" },
        { status: 403 },
      );

    const body = await req.json();
    const { renterId } = body;

    if (!renterId)
      return NextResponse.json({ error: "Missing renterId" }, { status: 400 });

    const snap = await getDoc(doc(db, "riskProfiles", renterId));
    if (!snap.exists())
      return NextResponse.json(
        { message: "No risk profile found for this renter" },
        { status: 404 },
      );

    const data = snap.data();

    // Log API usage for metered billing
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/enterprise/usage-log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: client.id,
        renterId,
        endpoint: "risk-intelligence",
        timestamp: new Date().toISOString(),
      }),
    });

    return NextResponse.json({
      renterId,
      score: data.score,
      aiSummary: data.aiSummary,
      signalsCount: data.signalsCount,
      updatedAt: data.updatedAt,
    });
  } catch (err) {
    console.error("Enterprise risk intelligence error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve data" },
      { status: 500 },
    );
  }
}

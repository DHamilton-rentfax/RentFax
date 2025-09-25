import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")!;
  const [orgId, renterId] = Buffer.from(token, "base64").toString().split(":");

  const snap = await adminDB.collection(`orgs/${orgId}/disputes`).where("renterId", "==", renterId).get();
  return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}

export async function POST(req: NextRequest) {
  const { token, subject, details } = await req.json();
  const [orgId, renterId] = Buffer.from(token, "base64").toString().split(":");

  const ref = await adminDB.collection(`orgs/${orgId}/disputes`).add({
    renterId,
    subject,
    details,
    status: "open",
    createdAt: Date.now(),
  });

  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/firestore/disputes`, {
    method: "POST",
    body: JSON.stringify({ orgId, renterId, type: "dispute_created", disputeId: ref.id }),
  });

  return NextResponse.json({ id: ref.id });
}

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")!;
  const [orgId, renterId] = Buffer.from(token, "base64").toString().split(":");

  const snap = await adminDb
    .collection(`orgs/${orgId}/renters/${renterId}/messages`)
    .orderBy("createdAt", "asc")
    .get();

  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function POST(req: NextRequest) {
  const { token, text } = await req.json();
  const [orgId, renterId] = Buffer.from(token, "base64").toString().split(":");

  const ref = await adminDb
    .collection(`orgs/${orgId}/renters/${renterId}/messages`)
    .add({
      from: "renter", // Or "landlord"
      text,
      createdAt: Date.now(),
    });

  return NextResponse.json({ id: ref.id });
}

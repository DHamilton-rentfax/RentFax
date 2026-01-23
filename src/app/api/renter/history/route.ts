import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")!;
  const [orgId, renterId] = Buffer.from(token, "base64").toString().split(":");

  const snap = await adminDb
    .collection(`orgs/${orgId}/incidents`)
    .where("renterId", "==", renterId)
    .get();
  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

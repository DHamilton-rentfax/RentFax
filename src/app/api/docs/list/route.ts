import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get("orgId")!;
  const snap = await adminDb
    .collection(`orgs/${orgId}/docs`)
    .orderBy("createdAt", "desc")
    .get();
  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

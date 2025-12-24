import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { requireSupportRole } from "@/lib/auth/roles";

export async function GET(req: NextRequest) {
  requireSupportRole(req);

  const snap = await adminDb
    .collection("support_threads")
    .orderBy("updatedAt", "desc")
    .limit(200)
    .get();

  const threads = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  return NextResponse.json({ threads });
}

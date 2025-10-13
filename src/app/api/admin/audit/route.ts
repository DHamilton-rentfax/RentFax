import { NextRequest, NextResponse } from "next/server";
import { dbAdmin as db } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50", 10);
  const snap = await db
    .collection("auditGlobal")
    .orderBy("timestamp", "desc")
    .limit(limit)
    .get();

  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

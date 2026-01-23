import { NextRequest, NextResponse } from "next/server";
import { dbAdmin as db } from "@@/firebase/server";

export async function GET(req: NextRequest) {
  const snap = await db
    .collectionGroup("fraudReports")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

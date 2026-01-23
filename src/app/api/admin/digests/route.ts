import { NextResponse } from "next/server";
import { dbAdmin as db } from "@@/firebase/server";

export async function GET() {
  const snap = await db
    .collection("digestRuns")
    .orderBy("startedAt", "desc")
    .limit(20)
    .get();
  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

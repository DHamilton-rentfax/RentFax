import { NextResponse } from "next/server";
import { dbAdmin as db } from "@/lib/firebase-admin";

export async function GET() {
  const snap = await db
    .collection("digestRuns")
    .orderBy("startedAt", "desc")
    .limit(20)
    .get();
  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

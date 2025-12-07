import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const snap = await adminDb
    .collection("identitySessions")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  const sessions = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return NextResponse.json({ sessions });
}

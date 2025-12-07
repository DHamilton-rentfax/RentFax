import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  const snap = await adminDb
    .collection("identitySessions")
    .where("status", "==", "submitted")
    .get();

  const items = snap.docs.map((d) => d.data());

  return NextResponse.json({ items });
}

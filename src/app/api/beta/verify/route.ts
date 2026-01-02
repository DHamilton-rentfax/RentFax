import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();

  const snap = await adminDb
    .collection("beta_invites")
    .where("code", "==", code)
    .where("used", "==", false)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}

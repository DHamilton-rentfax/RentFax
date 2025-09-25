import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid")!;
  const userDoc = await adminDB.doc(`users/${uid}`).get();
  return NextResponse.json(userDoc.exists ? userDoc.get("notificationPrefs") : {});
}

export async function POST(req: NextRequest) {
  const { uid, prefs } = await req.json();
  await adminDB.doc(`users/${uid}`).set({ notificationPrefs: prefs }, { merge: true });
  return NextResponse.json({ ok: true });
}

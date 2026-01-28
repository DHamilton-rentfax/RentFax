import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { logo, primary } = await req.json();
  const orgId = "TODO-get-from-auth"; // fetch from session
  await adminDb
    .doc(`orgs/${orgId}`)
    .set({ branding: { logo, primary } }, { merge: true });
  return NextResponse.json({ ok: true });
}

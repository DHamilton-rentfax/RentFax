import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function POST(req: NextRequest) {
  const { logo, primary } = await req.json();
  const orgId = "TODO-get-from-auth"; // fetch from session
  await adminDB.doc(\`orgs/${orgId}\`).set({ branding: { logo, primary } }, { merge: true });
  return NextResponse.json({ ok: true });
}

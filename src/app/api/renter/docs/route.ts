import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const token = req.nextUrl.searchParams.get("token")!;
  const [orgId, renterId] = Buffer.from(token, "base64").toString().split(":");

  const snap = await adminDb
    .collection(`orgs/${orgId}/renters/${renterId}/docs`)
    .where("visibleToRenter", "==", true)
    .get();

  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

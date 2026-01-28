import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const orgId = req.nextUrl.searchParams.get("orgId")!;
  const snap = await adminDb
    .collection(`orgs/${orgId}/fraudReports`)
    .orderBy("createdAt", "desc")
    .limit(20)
    .get();

  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

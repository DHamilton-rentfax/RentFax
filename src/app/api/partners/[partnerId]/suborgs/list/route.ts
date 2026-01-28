import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(
  _: Request,
  { params }: { params: { partnerId: string } },
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const subs = await adminDb
    .collection(`partners/${params.partnerId}/suborgs`)
    .get();
  return NextResponse.json(subs.docs.map((d) => ({ id: d.id, ...d.data() })));
}

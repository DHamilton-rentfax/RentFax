import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { partnerId: string } },
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { partnerId } = params;
  const { orgName } = await req.json();

  const ref = await adminDb
    .collection("partners")
    .doc(partnerId)
    .collection("suborgs")
    .add({
      orgName,
      createdAt: Date.now(),
    });

  return NextResponse.json({ subOrgId: ref.id });
}

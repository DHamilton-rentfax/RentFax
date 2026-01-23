import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } },
) {
  const { orgId } = params;
  const rentersSnap = await adminDb.collection(`orgs/${orgId}/renters`).get();
  const disputesSnap = await adminDb.collection(`orgs/${orgId}/disputes`).get();

  return NextResponse.json({
    renters: rentersSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    disputes: disputesSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { orgId: string } },
) {
  const { orgId } = params;
  // delete renters
  const rentersSnap = await adminDb.collection(`orgs/${orgId}/renters`).get();
  for (const doc of rentersSnap.docs) {
    await doc.ref.delete();
  }
  // delete disputes
  const disputesSnap = await adminDb.collection(`orgs/${orgId}/disputes`).get();
  for (const doc of disputesSnap.docs) {
    await doc.ref.delete();
  }
  return NextResponse.json({ ok: true });
}

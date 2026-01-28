import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { tenantId, email, role, invitedBy } = await req.json();

  await adminDb.collection(`tenant_invites`).add({
    tenantId,
    email,
    role,
    invitedBy,
    status: "pending",
    createdAt: FieldValue.serverTimestamp()
  });

  return NextResponse.json({ success: true });
}

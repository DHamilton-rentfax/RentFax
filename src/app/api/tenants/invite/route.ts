import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
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

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { requireSupportRole } from "@/lib/auth/roles";
import { FieldValue } from "firebase-admin/firestore";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  await requireSupportRole(req);

  const body = await req.json();

  await adminDb
    .collection("support_content_backlog")
    .doc(params.ticketId)
    .update({
      ...body,
      updatedAt: FieldValue.serverTimestamp(),
    });

  return NextResponse.json({ success: true });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  await requireSupportRole(req);

  const doc = await adminDb
    .collection("support_content_backlog")
    .doc(params.ticketId)
    .get();

  if (!doc.exists) {
    return NextResponse.json(
      { error: "Ticket not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: doc.id,
    ...doc.data(),
  });
}

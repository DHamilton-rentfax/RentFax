import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { requireSupportRole } from "@/lib/auth/roles";

export async function PATCH(req: NextRequest, { params }: { { params }: { params: { reportNameId: string } } }) {
  requireSupportRole(req);
  const body = await req.json();

  await adminDb
    .collection("support_content_backlog")
    .doc(params.id)
    .update({
      ...body,
      updatedAt: new Date(),
    });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest, { params }: { { params }: { params: { reportNameId: string } } }) {
  requireSupportRole(req);

  const doc = await adminDb
    .collection("support_content_backlog")
    .doc(params.id)
    .get();

    if (!doc.exists) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

  return NextResponse.json({ item: { id: doc.id, ...doc.data() } });
}

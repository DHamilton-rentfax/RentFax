import { adminDb } from "@/firebase/server";
import { requireSupportRole } from "@/lib/auth/roles";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { threadId: string } }) {
  requireSupportRole(req);
  const { threadId } = params;
  const body = await req.json();

  await adminDb.collection("support_threads").doc(threadId).update({
    ...body,
    updatedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}

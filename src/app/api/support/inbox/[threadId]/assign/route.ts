import { getAdminDb } from "@/firebase/server";
import { requireSupportRole } from "@/lib/auth/roles";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { threadId: string } }) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const user = requireSupportRole(req);
  const { threadId } = params;

  const { staffId, staffName } = await req.json();

  await adminDb.collection("support_threads").doc(threadId).update({
    assignedTo: staffId,
    assignedToName: staffName,
    assignedBy: user,
    assignedAt: new Date(),
    status: "pending",
  });

  return NextResponse.json({ success: true });
}

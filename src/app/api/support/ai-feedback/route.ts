import { getAdminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromHeaders, requireSupportRole } from "@/lib/auth/roles";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const userId = getUserIdFromHeaders(req.headers);
  requireSupportRole(req);

  const {
    threadId,
    messageId,
    originalQuery,
    aiResponse,
    correctedResponse,
    improvementType,
    context,
    userRole,
    severity
  } = await req.json();

  if (!correctedResponse || !improvementType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await adminDb.collection("support_ai_feedback").add({
    threadId,
    messageId,
    originalQuery,
    aiResponse,
    correctedResponse,
    improvementType,
    context,
    userRole,
    severity,
    status: "new",
    createdBy: userId,
    createdAt: new Date()
  });

  return NextResponse.json({ success: true });
}

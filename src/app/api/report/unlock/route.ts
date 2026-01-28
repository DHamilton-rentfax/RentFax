import { getAdminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { companyId, renterId, purchaseId } = await req.json();

  await adminDb.collection("reportUnlocks").add({
    companyId,
    renterId,
    purchaseId,
    createdAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}

import { adminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";
import { requireSupportRole } from "@/lib/auth/roles";

export async function GET(req: NextRequest) {
  requireSupportRole(req);

  const snap = await adminDb
    .collection("support_ai_feedback")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  const items = snap.docs.map((d) => ({ 
    id: d.id, 
    ...d.data(),
    createdAt: d.data().createdAt.toDate(), // Convert timestamp
  }));

  return NextResponse.json({ items });
}

import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { companyId, email, role } = await req.json();

  // In a real app, you'd also send an email with a unique invite link
  const inviteRef = await adminDb.collection("invites").add({
    companyId,
    email,
    role,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, inviteId: inviteRef.id });
}

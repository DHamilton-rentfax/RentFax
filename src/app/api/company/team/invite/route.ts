import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
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

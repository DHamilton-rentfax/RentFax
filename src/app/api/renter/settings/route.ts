import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { authMiddleware } from "@/lib/auth-middleware";

export const POST = authMiddleware(async (req, { user }) => {
  const data = await req.json();

  await adminDb.collection("renters").doc(user.uid).update({
    email: data.email,
    phone: data.phone,
    smsEnabled: data.smsEnabled,
    emailEnabled: data.emailEnabled,
  });

  return NextResponse.json({ success: true });
});

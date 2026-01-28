import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { authMiddleware } from "@/lib/auth-middleware";

export const POST = authMiddleware(async (req, { user }) => {
  const { id } = await req.json();

  await db
    .collection("renters")
    .doc(user.uid)
    .collection("notifications")
    .doc(id)
    .update({ read: true });

  return NextResponse.json({ success: true });
});

import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { authMiddleware } from "@/lib/auth-middleware";

export const GET = authMiddleware(async (req, { user }) => {
  const ref = adminDb.collection("renters").doc(user.uid);
  const doc = await ref.get();

  return NextResponse.json(doc.data());
});

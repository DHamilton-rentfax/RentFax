import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { authMiddleware } from "@/lib/auth-middleware";

export const GET = authMiddleware(async (req, { user }) => {

  const ref = adminDb.collection("renters").doc(user.uid);

  const sessions = await ref.collection("sessions").orderBy("lastActive", "desc").get();
  const history = await ref.collection("loginHistory").orderBy("time", "desc").limit(20).get();

  return NextResponse.json({
    sessions: sessions.docs.map((d) => d.data()),
    history: history.docs.map((d) => d.data()),
  });
});

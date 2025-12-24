import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { getDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";

const MAX_SENDS = 3;

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const ref = doc(db, "self_verifications", token);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  const data = snap.data();

  if (data.used) {
    return NextResponse.json(
      { error: "Verification already completed" },
      { status: 409 }
    );
  }

  if ((data.sendCount ?? 0) >= MAX_SENDS) {
    return NextResponse.json(
      { error: "Maximum resend attempts reached" },
      { status: 429 }
    );
  }

  // TODO: integrate SMS provider here

  await updateDoc(ref, {
    sendCount: (data.sendCount ?? 0) + 1,
    lastSentAt: serverTimestamp(),
  });

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { userId, action, metadata } = await req.json();
    if (!userId || !action)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const ref = doc(db, "consents", userId);
    const snap = await getDoc(ref);
    const prev = snap.exists() ? snap.data() : {};

    await setDoc(ref, {
      ...prev,
      [action]: {
        granted: true,
        timestamp: new Date().toISOString(),
        metadata: metadata || {},
      },
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Consent API error:", err);
    return NextResponse.json(
      { error: "Failed to save consent" },
      { status: 500 },
    );
  }
}

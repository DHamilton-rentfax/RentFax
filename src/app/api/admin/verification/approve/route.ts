import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  const ref = adminDb.collection("identitySessions").doc(sessionId);
  const doc = await ref.get();
  if (!doc.exists)
    return NextResponse.json({ error: "Session not found." }, { status: 404 });

  const data = doc.data()!;

  await ref.update({
    status: "approved",
    adminReviewedAt: Date.now(),
  });

  // Attach to renter profile if they exist
  if (data.renter.email) {
    const renterSnap = await adminDb
      .collection("renters")
      .where("email", "==", data.renter.email)
      .limit(1)
      .get();

    if (!renterSnap.empty) {
      const renterRef = renterSnap.docs[0].ref;
      await renterRef.update({
        isVerified: true,
        verifiedAt: Date.now(),
        verifiedSessionId: sessionId,
      });
    }
  }

  return NextResponse.json({ success: true });
}

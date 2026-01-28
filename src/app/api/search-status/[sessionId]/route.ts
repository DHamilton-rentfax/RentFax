import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";  // ⬅ Correct Admin SDK import

export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const sessionId = params.sessionId;

    const snap = await adminDb.collection("searchStatus").doc(sessionId).get();

    if (!snap.exists) {
      return NextResponse.json({ ready: false });
    }

    const data = snap.data() || {};

    return NextResponse.json({
      ready: Boolean(data.ready),
      renterId: data.renterId ?? null,
      type: data.type ?? null,
    });
  } catch (err: any) {
    console.error("Search Status Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error", ready: false },
      { status: 500 }
    );
  }
}

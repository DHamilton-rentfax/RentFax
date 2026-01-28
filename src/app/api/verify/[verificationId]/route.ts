import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(
  req: Request,
  { params }: { params: { verificationId: string } }
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const doc = await adminDb
      .collection("verification_requests")
      .doc(params.verificationId)
      .get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (err) {
    console.error("Verification fetch error", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

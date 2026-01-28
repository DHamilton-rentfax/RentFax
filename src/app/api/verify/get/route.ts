import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token)
      return NextResponse.json(
        { error: "Missing token." },
        { status: 400 }
      );

    const doc = await adminDb
      .collection("identityVerifications")
      .doc(token)
      .get();

    if (!doc.exists)
      return NextResponse.json(
        { error: "Verification request not found." },
        { status: 404 }
      );

    return NextResponse.json({ request: doc.data() });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load verification request." },
      { status: 500 }
    );
  }
}


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

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const snap = await adminDb
      .collection("identityVerifications")
      .doc(token)
      .get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 404 }
      );
    }

    const data = snap.data();

    return NextResponse.json({
      renter: data.renter,
      status: data.status,
      searchSessionId: data.searchSessionId || null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load verification" },
      { status: 500 }
    );
  }
}

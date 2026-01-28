
import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { fullName, email, licenseNumber } = await req.json();

    // Your search logic
    const rentersRef = adminDb.collection("users");

    const snapshot = await rentersRef
      .where("fullName", "==", fullName)
      .get();

    return NextResponse.json({
      success: true,
      results: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    });

  } catch (error) {
    console.error("🔥 Error in search-renter:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

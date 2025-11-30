
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
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

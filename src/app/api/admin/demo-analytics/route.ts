import { NextResponse } from "next/server";
import { adminDb as db } from "@/firebase/server"; // ✅ fixed import path

export async function GET() {
  try {
    // Example Firestore query
    const snapshot = await db.collection("demo_analytics").get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching demo analytics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch demo analytics." },
      { status: 500 },
    );
  }
}

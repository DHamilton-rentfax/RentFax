import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    // Simple test: write & read a test doc
    const testRef = adminDb.collection("admin_test").doc("ping");

    await testRef.set({
      ok: true,
      timestamp: Date.now(),
    });

    const snapshot = await testRef.get();

    return NextResponse.json({
      success: true,
      message: "Firebase Admin connected successfully!",
      data: snapshot.data(),
    });
  } catch (error) {
    console.error("🔥 Admin Test Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}

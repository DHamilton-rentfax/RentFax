import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(req: Request) {
  try {
    // Implement your authentication check here
    // For example, check for a valid admin session or API key

    const snapshot = await adminDb
      .collection("identityVerifications")
      .where("status", "==", "submitted")
      .orderBy("submittedAt", "desc")
      .get();

    const sessions = snapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ sessions });
  } catch (err) {
    console.error("Admin list error:", err);
    return NextResponse.json({ error: "Failed to list sessions." }, { status: 500 });
  }
}

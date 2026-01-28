import { getAdminDb } from "@/firebase/server";

import { NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";


export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const app = getFirebaseAdminApp();
    

    const snap = await db
      .collection("searchStatus")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const records = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ records });
  } catch (err: any) {
    console.error("GET /api/search/recent error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load search records" },
      { status: 500 }
    );
  }
}

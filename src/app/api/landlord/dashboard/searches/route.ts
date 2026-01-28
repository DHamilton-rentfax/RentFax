import { getAdminDb } from "@/firebase/server";
import { NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";


export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const app = getFirebaseAdminApp();
    

    // Extract user ID
    const authHeader = req.headers.get("x-user-id");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing user ID" },
        { status: 401 }
      );
    }

    const userId = authHeader;

    const snapshot = await db
      .collection("searchSessions")
      .where("createdBy", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const searches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ searches });
  } catch (err: any) {
    console.error("Search history error:", err);
    return NextResponse.json(
      { error: err.message || "Search history failed" },
      { status: 500 }
    );
  }
}

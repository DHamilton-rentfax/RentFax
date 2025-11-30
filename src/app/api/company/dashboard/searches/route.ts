import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";


export async function GET(req: Request) {
  try {
    const app = getFirebaseAdminApp();
    

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Missing user ID" },
        { status: 401 }
      );
    }

    const snapshot = await db
      .collection("searchSessions")
      .where("createdBy", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(15)
      .get();

    const searches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ searches });
  } catch (err: any) {
    console.error("company search error:", err);
    return NextResponse.json(
      { error: err.message || "Search history failed" },
      { status: 500 }
    );
  }
}

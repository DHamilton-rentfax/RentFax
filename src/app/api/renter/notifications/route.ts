import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";


export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const notificationsQuery = query(
      collection(adminDb, "notifications"),
      where("renterId", "==", uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(notificationsQuery);

    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

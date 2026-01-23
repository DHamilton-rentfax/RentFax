import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export async function GET(req: Request) {
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

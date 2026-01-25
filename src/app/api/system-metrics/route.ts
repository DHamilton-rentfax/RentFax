import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebase-admin";
import { getAuth } from "firebase-admin/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await getAuth().verifyIdToken(token);

    const userDoc = await adminDb
      .collection("users")
      .doc(decoded.uid)
      .get();

    const role = userDoc.data()?.role || "USER";
    if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [usersSnap, disputesSnap, incidentsSnap] = await Promise.all([
      adminDb.collection("users").get(),
      adminDb.collection("disputes").get(),
      adminDb.collection("incidents").get(),
    ]);

    return NextResponse.json({
      activeUsers: usersSnap.size,
      disputes: disputesSnap.size,
      incidents: incidentsSnap.size,
    });
  } catch (err) {
    console.error("System metrics error", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { auth } from "@/firebase/server";

export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const sessionCookie = req.headers.get("cookie")?.split("__session=")[1] || "";
    const decodedToken = await auth.verifySessionCookie(sessionCookie);

    if (!decodedToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const renterId = decodedToken.uid;

    const snap = await adminDb
      .collection("incidents")
      .where("renterId", "==", renterId)
      .orderBy("createdAt", "desc")
      .get();

    const incidents = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json(incidents);
  } catch (err) {
      console.error(err)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

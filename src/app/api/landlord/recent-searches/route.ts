import { adminDb } from "@/lib/server/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromSessionCookie } from "@/lib/auth/getUserFromSessionCookie";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromSessionCookie(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const companyId = user.companyId;

    if (!companyId) {
        return NextResponse.json({ error: "User is not associated with a company." }, { status: 403 });
    }

    const snap = await adminDb
      .collection("searches")
      .where("companyId", "==", companyId)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ searches: data });
  } catch (err: any) {
    console.error("Recent Searches Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

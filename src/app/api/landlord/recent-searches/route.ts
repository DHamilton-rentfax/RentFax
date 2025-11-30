import { adminDb } from "@/firebase/server";

import { NextResponse } from "next/server";
import { verifySessionServer } from "@/lib/verifySessionServer";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";


export async function GET() {
  try {
    const session = await verifySessionServer();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const companyId = session.claims?.companyId;

    if (!companyId) {
        return NextResponse.json({ error: "User is not associated with a company." }, { status: 403 });
    }

    );

    const snap = await db
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

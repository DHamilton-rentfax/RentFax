import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token);

    const orgId = decoded.orgId;
    if (!orgId)
      return NextResponse.json({ error: "No org found" }, { status: 403 });

    const orgDoc = await adminDb.collection("orgs").doc(orgId).get();
    if (!orgDoc.exists)
      return NextResponse.json({ error: "Org not found" }, { status: 404 });

    const orgData = orgDoc.data()!;
    const plan = orgData.plan;
    const addons = orgData.addons || [];

    if (
      plan !== "enterprise" &&
      !addons.includes("addon_client_reports_monthly")
    ) {
      return NextResponse.json({ error: "Not entitled" }, { status: 403 });
    }

    const snap = await adminDb
      .collection("reports")
      .where("orgId", "==", orgId)
      .where("type", "==", "client_monthly")
      .orderBy("createdAt", "desc")
      .get();

    const reports = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ reports, plan });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

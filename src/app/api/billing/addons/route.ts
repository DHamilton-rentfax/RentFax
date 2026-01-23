import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/server";
import { ADDON_CATALOG } from "@/lib/addons";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const companyId = decoded.companyId;
    if (!companyId) {
      return NextResponse.json(
        { error: "User is not associated with a company." },
        { status: 400 },
      );
    }

    const doc = await adminDb.collection("companies").doc(companyId).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: "Company not found." },
        { status: 404 },
      );
    }
    const activeAddons = (doc.data()?.addons || []) as string[];

    return NextResponse.json({ catalog: ADDON_CATALOG, active: activeAddons });
  } catch (err: any) {
    console.error("Billing addons error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

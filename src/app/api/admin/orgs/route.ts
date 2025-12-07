import { NextResponse } from "next/server";
import { authAdmin, dbAdmin } from "@/firebase/client-admin";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await authAdmin.verifyIdToken(token);

    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snapshot = await dbAdmin.collection("companies").get();
    const orgs = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        plan: data.plan,
        addons: data.addons || [],
        reportCredits: data.reportCredits || 0,
        updatedAt: data.updatedAt?.toMillis() || data.createdAt?.toMillis(),
      };
    });

    return NextResponse.json({ orgs });
  } catch (err: any) {
    console.error("Super Admin Orgs Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

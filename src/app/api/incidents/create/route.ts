
import { NextRequest, NextResponse } from "next/server";
import { adminDb, serverTimestamp } from "@/firebase/server";
import { authGuard } from "@/lib/auth/auth-guard";
import { createIncident } from "@/lib/incidents/createIncident";

export async function POST(req: NextRequest) {
  try {
    const user = await authGuard(req, { allow: ["COMPANY", "LANDLORD", "LEGAL"] });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // REQUIRED FIELDS VALIDATION
    const required = ["renterId", "companyId", "category", "details"];
    const missing = required.filter((f) => !body[f]);

    if (missing.length) {
      return NextResponse.json(
        { error: `Missing fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const incident = await createIncident({
      renterId: body.renterId,
      companyId: body.companyId,
      createdBy: user.uid,
      category: body.category,
      details: body.details,
      evidence: body.evidence || [],
      cost: body.cost || null,
      metadata: body.metadata || {},
    });

    return NextResponse.json(incident, { status: 200 });
  } catch (err: any) {
    console.error("INCIDENT_CREATE_ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Server Error" },
      { status: 500 }
    );
  }
}

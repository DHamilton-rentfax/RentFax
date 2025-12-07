import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { v4 as uuid } from "uuid";
import type { RenterTimelineEvent } from "@/types/timeline";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<RenterTimelineEvent>;

    if (!body.renterId || !body.type || !body.severity || !body.label) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = uuid();
    const now = new Date().toISOString();

    const event: RenterTimelineEvent = {
      id,
      renterId: body.renterId!,
      companyId: body.companyId || null!,
      type: body.type,
      severity: body.severity,
      label: body.label,
      description: body.description || "",
      refCollection: body.refCollection || "",
      refId: body.refId || "",
      createdAt: now,
      createdByUserId: body.createdByUserId || "",
    };

    await adminDb.collection("renterTimeline").doc(id).set(event);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Error adding renter timeline event", err);
    return NextResponse.json(
      { error: "Failed to add event" },
      { status: 500 }
    );
  }
}

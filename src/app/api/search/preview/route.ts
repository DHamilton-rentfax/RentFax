import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { checkTimeline } from "@/lib/search/timeline-check";

export async function POST(req: Request) {
  const { renterId } = await req.json();

  if (!renterId) {
    return NextResponse.json({ error: "Missing renterId" }, { status: 400 });
  }

  const doc = await adminDb.collection("renters").doc(renterId).get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = doc.data();
  const timeline = await checkTimeline([{ id: renterId }]);

  return NextResponse.json({
    preview: {
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      identityScore: data.identityScore ?? null,
      fraudScore: data.fraudScore ?? null,
      hasTimeline: timeline.exists,
    },
  });
}
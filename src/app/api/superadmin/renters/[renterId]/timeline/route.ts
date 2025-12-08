import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { buildTimeline } from "@/lib/timeline/buildTimeline";

export async function GET(
  req: Request,
  { params }: { params: { renterId: string } }
) {
  const renterId = params.renterId;

  const [incidents, disputes, payments, verifications, flags, overrides, freezes] =
    await Promise.all([
      adminDb.collection("incidents").where("renterId", "==", renterId).get(),
      adminDb.collection("disputes").where("renterId", "==", renterId).get(),
      adminDb.collection("payments").where("renterId", "==", renterId).get(),
      adminDb.collection("verifications").where("renterId", "==", renterId).get(),
      adminDb.collection("flags").where("renterId", "==", renterId).get(),
      adminDb.collection("overrides").where("renterId", "==", renterId).get(),
      adminDb.collection("freezes").where("renterId", "==", renterId).get(),
    ]);

  const timeline = buildTimeline({
    incidents: incidents.docs.map((d) => ({ id: d.id, ...d.data() })),
    disputes: disputes.docs.map((d) => ({ id: d.id, ...d.data() })),
    payments: payments.docs.map((d) => ({ id: d.id, ...d.data() })),
    verifications: verifications.docs.map((d) => ({ id: d.id, ...d.data() })),
    flags: flags.docs.map((d) => ({ id: d.id, ...d.data() })),
    overrides: overrides.docs.map((d) => ({ id: d.id, ...d.data() })),
    freezes: freezes.docs.map((d) => ({ id: d.id, ...d.data() })),
  });

  return NextResponse.json({ timeline });
}

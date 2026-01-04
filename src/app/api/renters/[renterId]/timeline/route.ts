import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(_: Request, { params }: { params: { renterId: string } }) {
  const renterId = params.renterId;

  const events: any[] = [];

  const audits = await adminDb
    .collection("audit_logs")
    .where("renterId", "==", renterId)
    .get();

  audits.forEach(d => events.push(d.data()));

  events.sort((a, b) => a.ts - b.ts);

  return NextResponse.json(events);
}

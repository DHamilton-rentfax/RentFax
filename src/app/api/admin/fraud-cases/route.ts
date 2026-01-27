import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";
import { db } from "@/firebase/server";


export async function GET() {
  const q = query(
    collection(db, "renters"),
    where("fraudFlag", "==", true)
  );

  const snap = await getDocs(q);

  const cases = snap.docs.map((d) => ({
    renterId: d.id,
    fraudReason: d.data().fraudReason,
    fraudAt: d.data().fraudAt,
    reportId: d.data().reportId ?? null,
  }));

  return NextResponse.json({ cases });
}

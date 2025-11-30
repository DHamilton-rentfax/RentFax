import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const body = await req.json();
  const { matchedRenterId, userId, role, payload } = body;

  const reportId = crypto.randomUUID();

  await setDoc(doc(db, "reports", reportId), {
    reportId,
    renterId: matchedRenterId,
    createdBy: userId,
    role,
    status: "COMPLETE",
    ...payload,
    createdAt: serverTimestamp(),
  });

  return NextResponse.json({ reportId });
}

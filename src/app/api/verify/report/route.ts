import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { detectTampering } from "@/functions/src/blockchain/tamperCheck"; // Assuming this is compiled and available

export async function POST(req: Request) {
  const { apiKey, reportId, hash } = await req.json();

  const q = query(
    collection(db, "verify_api_keys"),
    where("key", "==", apiKey)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
  }

  const isTampered = await detectTampering(reportId, hash);

  if (isTampered.tampered) {
    return NextResponse.json({ verified: false, reason: "Tampering detected" });
  }

  return NextResponse.json({ verified: true });
}

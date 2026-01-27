import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";
import { db } from "@/firebase/server";

import { hashLicense } from "@/lib/fraud/hashLicense";
import { detectLicenseReuse } from "@/lib/fraud/signals/licenseReuseSignal";

export async function POST(req: Request) {
  try {
    const { licenseNumber, renterId, reportId } = await req.json();

    if (!licenseNumber || !renterId || !reportId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const licenseHash = hashLicense(licenseNumber);
    const ref = doc(db, "licenseHashes", licenseHash);
    const snap = await getDoc(ref);

    let reuseCount = 1;

    if (!snap.exists()) {
      await setDoc(ref, {
        count: 1,
        renterIds: [renterId],
        reportIds: [reportId],
        firstSeenAt: new Date(),
        lastSeenAt: new Date(),
      });
    } else {
      const data = snap.data();
      reuseCount = (data.count || 1) + 1;

      await updateDoc(ref, {
        count: reuseCount,
        renterIds: arrayUnion(renterId),
        reportIds: arrayUnion(reportId),
        lastSeenAt: new Date(),
      });
    }

    const signal = detectLicenseReuse(reuseCount);

    return NextResponse.json({
      reuseCount,
      signal,
    });
  } catch (err) {
    console.error("LICENSE REUSE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to evaluate license reuse" },
      { status: 500 }
    );
  }
}

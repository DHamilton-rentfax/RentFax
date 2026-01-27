import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

import { hashLicense } from "@/lib/security/hashLicense";
import { detectLicenseReuse } from "@/lib/fraud/detectLicenseReuse";
import { licenseReuseSignal } from "@/lib/fraud/signals/licenseReuseSignal";

export async function POST(req: NextRequest) {
  try {
    const { renterId, reportId, licenseNumber } = await req.json();

    if (!renterId || !reportId || !licenseNumber) {
      return NextResponse.json(
        { error: "Missing required fields for ID check." },
        { status: 400 }
      );
    }

    const licenseHash = hashLicense(licenseNumber);
    const renterRef = adminDb.collection("renters").doc(renterId);
    const reportRef = adminDb.collection("reports").doc(reportId);

    await renterRef.update({ licenseHash });

    const reuse = await detectLicenseReuse(licenseHash, renterId);

    if (reuse.reused) {
      const signal = licenseReuseSignal({
        licenseHash,
        reuseCount: reuse.count,
      });

      await reportRef.update({
        fraudSignals: FieldValue.arrayUnion(signal),
        fraudScore: FieldValue.increment(25),
        disputeLocked: true,
        flagged: true,
      });

      return NextResponse.json(
        {
          error: "This ID is associated with another user account.",
          fraudSignal: true,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, message: "ID check passed." });
  } catch (err) {
    console.error("ID CHECK API ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error during ID check." },
      { status: 500 }
    );
  }
}

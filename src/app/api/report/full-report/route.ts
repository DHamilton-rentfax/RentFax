import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FullReport } from "@/types/report";
import { verifyCreditsOrCharge } from "@/lib/billing/verifyCreditsOrCharge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { renterId, uid } = body;

    if (!renterId) {
      return NextResponse.json({ error: "Missing renterId" }, { status: 400 });
    }

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const renterRef = adminDb.collection("renters").doc(renterId);
    const renterSnap = await renterRef.get();
    const renter = renterSnap.data();

    if (!renter) {
      return NextResponse.json({ error: "Renter not found" }, { status: 404 });
    }

    const billing = await verifyCreditsOrCharge({
      uid: uid,
      requiredCredits: 20,
      description: "Full Renter Report",
    });

    if (!billing.allowed) {
      return NextResponse.json(
        { redirect: billing.checkoutUrl },
        { status: 402 }
      );
    }

    const fullReport: FullReport = {
      profile: {
        fullName: renter.fullName,
        email: renter.email,
        phone: renter.phone,
        address: renter.address,
      },
      identity: renter.identity,
      fraud: renter.fraud,
      publicData: renter.publicData,
      incidents: renter.incidents,
      riskScore: renter.riskScore,
      confidence: renter.confidence,
      createdAt: renter.createdAt
    };

    await renterRef.update({
      report: fullReport,
    });

    return NextResponse.json(fullReport);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

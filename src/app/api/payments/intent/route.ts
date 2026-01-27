import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";

import { db } from "@/firebase/server";
import { verifySession } from "@/lib/auth/verifySession";

type IntentPayload = {
  type: "PDPL" | "PAYG_REPORT";
  renterInput: {
    fullName: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    licenseNumber?: string | null;
  };
  reportId?: string | null;
};

export async function POST(req: Request) {
  const session = await verifySession();

  if (!session?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: IntentPayload = await req.json();

  if (!body?.type || !body?.renterInput?.fullName) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const isPDPL = body.type === "PDPL";
  const amount = isPDPL ? 4.99 : 20.0;

  try {
    const intentRef = await addDoc(collection(db, "payment_intents"), {
      uid: session.uid,
      companyId: session.companyId || null,

      type: body.type,
      amount,

      renterInput: body.renterInput,
      reportId: body.reportId || null,

      context: {
        reason: isPDPL ? "NO_EXISTING_REPORT" : "UNLOCK_REPORT",
      },

      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 🔓 INTERNAL COMPANY BYPASS
    if (session.companyBillingMode === "INTERNAL") {
      await updateDoc(doc(db, "payment_intents", intentRef.id), {
        status: "bypassed",
        completedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({
        intentId: intentRef.id,
        bypassed: true,
      });
    }

    // Stripe session created elsewhere (clean separation)
    return NextResponse.json({
      intentId: intentRef.id,
      amount,
      requiresPayment: true,
    });
  } catch (err) {
    console.error("Payment intent error:", err);
    return NextResponse.json({ error: "Failed to create intent" }, { status: 500 });
  }
}

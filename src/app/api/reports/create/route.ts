import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import { verifySession } from "@/lib/auth/verifySession";

/**
 * POST /reports/create
 *
 * Creates a RentFAX report ONLY after renter verification.
 * Handles subscription credit consumption OR PAYG validation.
 */
export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const session = await verifySession();

  if (!session?.uid || !session.companyId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const {
    renterId,
    paymentType, // "subscription" | "payg"
    paygIntentId, // required if paymentType === "payg"
  } = await req.json();

  if (!renterId || !paymentType) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const orgId = session.companyId;
  const userId = session.uid;

  try {
    const result = await adminDb.runTransaction(async (tx) => {
      /* ------------------------------------------------------------------ */
      /* RENTER VERIFICATION GATE                                            */
      /* ------------------------------------------------------------------ */

      const renterRef = adminDb.collection("renters").doc(renterId);
      const renterSnap = await tx.get(renterRef);

      if (!renterSnap.exists) {
        throw new Error("Renter not found");
      }

      const renter = renterSnap.data()!;
      if (!renter.verified) {
        throw new Error("Renter must be verified before creating a report");
      }

      /* ------------------------------------------------------------------ */
      /* ORG + BILLING                                                       */
      /* ------------------------------------------------------------------ */

      const orgRef = adminDb.collection("orgs").doc(orgId);
      const orgSnap = await tx.get(orgRef);

      if (!orgSnap.exists) {
        throw new Error("Organization not found");
      }

      const org = orgSnap.data()!;
      const billingOverride = Boolean(org.billing?.override);

      /* ------------------------------------------------------------------ */
      /* PAYMENT ENFORCEMENT                                                 */
      /* ------------------------------------------------------------------ */

      if (paymentType === "subscription" && !billingOverride) {
        const available = org.credits?.available ?? 0;

        if (available < 1) {
          throw new Error("Insufficient subscription credits");
        }

        tx.update(orgRef, {
          "credits.available": FieldValue.increment(-1),
        });
      }

      if (paymentType === "payg") {
        if (!paygIntentId) {
          throw new Error("Missing PAYG intent");
        }

        const intentRef = adminDb
          .collection("payment_intents")
          .doc(paygIntentId);

        const intentSnap = await tx.get(intentRef);

        if (!intentSnap.exists) {
          throw new Error("Invalid PAYG intent");
        }

        const intent = intentSnap.data()!;
        if (
          intent.status !== "paid" ||
          intent.uid !== userId ||
          intent.companyId !== orgId
        ) {
          throw new Error("PAYG intent is not valid or not paid");
        }

        // Lock the intent to prevent reuse
        tx.update(intentRef, {
          status: "consumed",
          consumedAt: FieldValue.serverTimestamp(),
        });
      }

      /* ------------------------------------------------------------------ */
      /* CREATE REPORT                                                       */
      /* ------------------------------------------------------------------ */

      const reportRef = adminDb.collection("reports").doc();

      tx.set(reportRef, {
        renterId,
        orgId,
        createdBy: userId,
        paymentType,
        verificationMethod: renter.verificationMethod,
        unlocked: true,
        createdAt: FieldValue.serverTimestamp(),
      });

      /* ------------------------------------------------------------------ */
      /* AUDIT LOG                                                           */
      /* ------------------------------------------------------------------ */

      const auditRef = orgRef.collection("auditLogs").doc();
      tx.set(auditRef, {
        action: "REPORT_CREATED",
        reportId: reportRef.id,
        renterId,
        paymentType,
        performedBy: userId,
        billingOverride,
        createdAt: FieldValue.serverTimestamp(),
      });

      return { reportId: reportRef.id };
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("REPORT CREATE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create report" },
      { status: 400 }
    );
  }
}

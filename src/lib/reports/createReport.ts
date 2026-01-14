import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type CreateReportParams = {
  renterId: string;
  orgId: string;
  createdBy: string;
  paymentType: "subscription" | "payg";
  paygIntentId?: string; // REQUIRED if paymentType === "payg"
};

/* -------------------------------------------------------------------------- */
/* CREATE REPORT (PRODUCTION GRADE)                                           */
/* -------------------------------------------------------------------------- */

export async function createReport({
  renterId,
  orgId,
  createdBy,
  paymentType,
  paygIntentId,
}: CreateReportParams) {
  const renterRef = adminDb.collection("renters").doc(renterId);
  const orgRef = adminDb.collection("orgs").doc(orgId);

  return adminDb.runTransaction(async (tx) => {
    /* ---------------------------------- RENTER ---------------------------------- */
    const renterSnap = await tx.get(renterRef);
    if (!renterSnap.exists) {
      throw new Error("Renter not found");
    }

    const renter = renterSnap.data()!;
    if (!renter.verified) {
      throw new Error("Renter must be verified before creating a report");
    }

    /* ---------------------------------- ORG ---------------------------------- */
    const orgSnap = await tx.get(orgRef);
    if (!orgSnap.exists) {
      throw new Error("Organization not found");
    }

    const org = orgSnap.data()!;

    /* ---------------------------------- PAYMENT ---------------------------------- */
    if (paymentType === "subscription") {
      if (!org.billing?.override) {
        const available = org.credits?.available ?? 0;
        if (available < 1) {
          throw new Error("Insufficient subscription credits");
        }

        tx.update(orgRef, {
          "credits.available": FieldValue.increment(-1),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    if (paymentType === "payg") {
      if (!paygIntentId) {
        throw new Error("Missing PAYG intent ID");
      }

      const intentRef = adminDb
        .collection("payment_intents")
        .doc(paygIntentId);

      const intentSnap = await tx.get(intentRef);
      if (!intentSnap.exists) {
        throw new Error("PAYG intent not found");
      }

      const intent = intentSnap.data()!;
      if (intent.status !== "paid") {
        throw new Error("PAYG intent not paid");
      }

      if (intent.consumed) {
        throw new Error("PAYG intent already used");
      }

      if (intent.orgId !== orgId) {
        throw new Error("PAYG intent does not belong to this org");
      }

      // Mark intent as consumed
      tx.update(intentRef, {
        consumed: true,
        consumedAt: FieldValue.serverTimestamp(),
      });
    }

    /* ---------------------------------- REPORT ---------------------------------- */
    const reportRef = adminDb.collection("reports").doc();

    tx.set(reportRef, {
      renterId,
      orgId,
      createdBy,
      paymentType,
      verificationMethod: renter.verificationMethod,
      status: "ACTIVE",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    /* ---------------------------------- AUDIT ---------------------------------- */
    const auditRef = orgRef.collection("auditLogs").doc();
    tx.set(auditRef, {
      action: "REPORT_CREATED",
      reportId: reportRef.id,
      renterId,
      paymentType,
      performedBy: createdBy,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { reportId: reportRef.id };
  });
}

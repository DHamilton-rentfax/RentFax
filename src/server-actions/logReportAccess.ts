"use server";

import { adminDb } from "@/firebase/server";
import crypto from "crypto";

export async function logReportAccess({
  reportId,
  uid,
  email,
  accountType,
  companyId,
  intentId,
  ip,
  userAgent,
}: any) {
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  await adminDb.collection("report_access_logs").add({
    reportId,
    accessedByUid: uid,
    accessedByEmail: email,
    accountType,
    companyId: companyId ?? null,
    purchaseIntentId: intentId,
    ipHash,
    userAgent,
    accessedAt: new Date(),
  });
}

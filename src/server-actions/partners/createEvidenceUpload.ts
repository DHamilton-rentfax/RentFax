"use server";

import { adminDb, adminStorage } from "@/firebase/server";
import { logPartnerUsage } from "./logPartnerUsage";

export async function createEvidenceUpload({
  caseId,
  partnerOrgId,
  partnerUid,
  partnerType,
  fileName,
  contentType,
  size,
}: {
  caseId: string;
  partnerOrgId: string;
  partnerUid: string;
  partnerType: "collection_agency" | "law_firm";
  fileName: string;
  contentType: string;
  size: number;
}) {
  const caseSnap = await adminDb
    .collection("case_assignments")
    .doc(caseId)
    .get();

  if (!caseSnap.exists) throw new Error("Case not found");
  if (caseSnap.data()!.assignedToOrgId !== partnerOrgId) {
    throw new Error("Unauthorized");
  }

  const evidenceRef = adminDb.collection("case_evidence").doc();
  const storagePath = `case-evidence/${caseId}/${evidenceRef.id}-${fileName}`;

  await evidenceRef.set({
    caseId,
    partnerOrgId,
    partnerUid,
    partnerType,
    fileName,
    storagePath,
    contentType,
    size,
    createdAt: new Date(),
  });

  const bucket = adminStorage.bucket();
  const file = bucket.file(storagePath);

  const [uploadUrl] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    contentType,
  });

  await logPartnerUsage({
    partnerOrgId,
    partnerType,
    partnerUid,
    eventType: "CASE_EVIDENCE_UPLOADED",
    caseId,
  });

  return { uploadUrl };
}

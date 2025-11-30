"use server";

import { adminDB, adminStorage } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { requireUser, requireCompanyPermission } from "@/utils/auth/permissions";

export const GenerateEvidenceUploadUrlInput = z.object({
  incidentId: z.string(),
  companyId: z.string(),
  renterId: z.string().nullable(),
  fileName: z.string(),
  fileType: z.string(),
});

/**
 * STEP 1 — Generate Upload Paths for Client-Side Direct Upload
 * ---------------------------------------------------------------
 * This server action generates:
 *  - storagePathRenter
 *  - storagePathCompany
 *  - signed upload token (optional later)
 */
export async function generateEvidenceUploadPaths(
  input: z.infer<typeof GenerateEvidenceUploadUrlInput>
) {
  const user = await requireUser();
  const parsed = GenerateEvidenceUploadUrlInput.parse(input);

  await requireCompanyPermission({
    userId: user.uid,
    companyId: parsed.companyId,
    permission: "createIncidents",
  });

  // 1. Create unified file name
  const safeName = `${Date.now()}-${parsed.fileName.replace(/\s+/g, "_")}`;

  // 2. Build hybrid storage paths
  const rentalPath = parsed.renterId
    ? `evidence/renters/${parsed.renterId}/${parsed.incidentId}/${safeName}`
    : null;

  const companyPath = `evidence/companies/${parsed.companyId}/${parsed.incidentId}/${safeName}`;

  return {
    success: true,
    fileName: safeName,
    renterStoragePath: rentalPath,
    companyStoragePath: companyPath,
  };
}

/**
 * STEP 2 — Save metadata AFTER the file is uploaded
 * --------------------------------------------------
 * Client uploads file → then calls this to finalize the record.
 */
export const SaveEvidenceMetadataInput = z.object({
  incidentId: z.string(),
  companyId: z.string(),
  renterId: z.string().nullable(),
  fileName: z.string(),
  fileType: z.string(),
  renterStoragePath: z.string().nullable(),
  companyStoragePath: z.string(),
});

export async function saveEvidenceMetadata(
  input: z.infer<typeof SaveEvidenceMetadataInput>
) {
  const user = await requireUser();
  const parsed = SaveEvidenceMetadataInput.parse(input);

  await requireCompanyPermission({
    userId: user.uid,
    companyId: parsed.companyId,
    permission: "createIncidents",
  });

  const incidentRef = adminDB.collection("incidents").doc(parsed.incidentId);

  const incidentSnap = await incidentRef.get();
  if (!incidentSnap.exists) throw new Error("Incident not found.");

  const fileMeta = {
    fileName: parsed.fileName,
    uploadedAt: Timestamp.now(),
    uploadedBy: user.uid,
    type: parsed.fileType,
    storagePath: parsed.companyStoragePath,
  };

  // Update incident record
  await incidentRef.update({
    evidence: adminDB.FieldValue.arrayUnion(fileMeta),
    updatedAt: Timestamp.now(),
  });

  // Add to timeline
  await incidentRef.collection("timeline").add({
    event: "evidence_uploaded",
    timestamp: Timestamp.now(),
    userId: user.uid,
    data: {
      fileName: parsed.fileName,
      fileType: parsed.fileType,
    },
  });

  return {
    success: true,
    metadata: fileMeta,
  };
}

/**
 * STEP 3 — Delete Evidence
 * -------------------------
 * Deletes from BOTH renter and company folders.
 */
export const DeleteEvidenceInput = z.object({
  incidentId: z.string(),
  companyId: z.string(),
  renterId: z.string().nullable(),
  storagePath: z.string(),
  fileName: z.string(),
});

export async function deleteEvidence(
  input: z.infer<typeof DeleteEvidenceInput>
) {
  const user = await requireUser();
  const parsed = DeleteEvidenceInput.parse(input);

  await requireCompanyPermission({
    userId: user.uid,
    companyId: parsed.companyId,
    permission: "createIncidents",
  });

  const incidentRef = adminDB.collection("incidents").doc(parsed.incidentId);

  // 1. Delete file from company folder
  await adminStorage.bucket().file(parsed.storagePath).delete().catch(() => "");

  // 2. Delete file from renter folder (if exists)
  if (parsed.renterId) {
    const renterPath = `evidence/renters/${parsed.renterId}/${parsed.incidentId}/${parsed.fileName}`;
    await adminStorage.bucket().file(renterPath).delete().catch(() => "");
  }

  // 3. Remove metadata
  await incidentRef.update({
    evidence: adminDB.FieldValue.arrayRemove({
      fileName: parsed.fileName,
      storagePath: parsed.storagePath,
    }),
    updatedAt: Timestamp.now(),
  });

  // 4. Timeline entry
  await incidentRef.collection("timeline").add({
    event: "evidence_deleted",
    timestamp: Timestamp.now(),
    userId: user.uid,
    data: {
      fileName: parsed.fileName,
    },
  });

  return { success: true };
}
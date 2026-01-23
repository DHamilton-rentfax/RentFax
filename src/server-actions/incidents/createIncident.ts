"use server";

import { adminDb } from "@/firebase/server";
import { IncidentSchema, IncidentStatusEnum } from "./types";
import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { requireUser, requireCompanyPermission } from "@/utils/auth/permissions";

// Validation schema for incoming data
export const CreateIncidentInput = z.object({
  companyId: z.string(),
  renterId: z.string().nullable(),
  industry: z.string(),
  type: z.string(),
  description: z.string().min(10),
  amount: z.number().optional(),
  occurredAt: z.coerce.date(),
});

/**
 * MAIN CREATE INCIDENT FUNCTION
 * ------------------------------
 * Logic:
 * 1. Validate request body
 * 2. Permission check (super admin, company admin, staff w/ permissions)
 * 3. Industry rules: require renterId for home rentals
 * 4. Create Firestore incident doc
 * 5. Pre-create evidence folders (paths, metadata ready)
 * 6. Add timeline entry
 * 7. Trigger fraud engine hook
 */
export async function createIncident(input: z.infer<typeof CreateIncidentInput>) {
  const user = await requireUser();

  // 1. Validate input
  const parsed = CreateIncidentInput.parse(input);

  // 2. Permission check
  await requireCompanyPermission({
    userId: user.uid,
    companyId: parsed.companyId,
    permission: "createIncidents",
  });

  // 3. Industry-specific validation
  if (parsed.industry === "home" && !parsed.renterId) {
    throw new Error("A renter must be selected for home rental incidents.");
  }

  // 4. Create Firestore incident doc
  const incidentRef = adminDb.collection("incidents").doc();

  const incidentData = {
    id: incidentRef.id,
    companyId: parsed.companyId,
    renterId: parsed.renterId ?? null,
    industry: parsed.industry,
    type: parsed.type,
    description: parsed.description,
    amount: parsed.amount ?? null,
    occurredAt: Timestamp.fromDate(parsed.occurredAt),
    status: IncidentStatusEnum.Values.reported,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: user.uid,
    evidence: [],
    fraudSignals: [],
  };

  await incidentRef.set(incidentData);

  // 5. Create timeline entry
  await adminDb
    .collection("incidents")
    .doc(incidentRef.id)
    .collection("timeline")
    .add({
      event: "incident_created",
      userId: user.uid,
      timestamp: Timestamp.now(),
      data: {
        description: parsed.description,
        industry: parsed.industry,
        type: parsed.type,
      },
    });

  // 6. Fraud Engine Hook
  await adminDb
    .collection("fraudQueue")
    .add({
      incidentId: incidentRef.id,
      renterId: parsed.renterId,
      companyId: parsed.companyId,
      triggeredAt: Timestamp.now(),
    });

  return {
    success: true,
    incidentId: incidentRef.id,
  };
}
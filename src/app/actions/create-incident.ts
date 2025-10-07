
"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import { logAuditEvent } from "./log-audit";

export async function createIncident(data: any, companyId: string, createdBy: string) {
  try {
    const ref = await dbAdmin.collection("incidents").add({
      ...data,
      companyId,
      createdBy,
      createdAt: new Date().toISOString(),
    });

    await logAuditEvent({
      action: "INCIDENT_CREATED",
      targetIncident: ref.id,
      targetCompany: companyId,
      changedBy: createdBy,
      metadata: { amount: data.amount, renter: data.renter },
    });

    return { success: true, id: ref.id };
  } catch (err) {
    console.error("Error creating incident:", err);
    return { success: false, error: (err as Error).message };
  }
}

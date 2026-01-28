"use server";

import { getAdminDb } from "@/firebase/server";
import { INDUSTRIES } from "@/constants/industries";

export async function updateCompanyIndustries(companyId: string, industries: string[]) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  if (!companyId) throw new Error("Missing companyId");

  // Validate each industry against the allowed list
  const allowed = INDUSTRIES.map(i => i.id);
  const invalid = industries.filter(i => !allowed.includes(i));

  if (invalid.length > 0) {
    throw new Error(`Invalid industries: ${invalid.join(", ")}`);
  }

  await adminDb.collection("companies").doc(companyId).update({
    industryTypes: industries,
    updatedAt: new Date(),
  });

  return { success: true };
}

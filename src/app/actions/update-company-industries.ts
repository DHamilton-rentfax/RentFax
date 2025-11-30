"use server";

import { adminDB } from "@/firebase/server";
import { INDUSTRIES } from "@/constants/industries";

export async function updateCompanyIndustries(companyId: string, industries: string[]) {
  if (!companyId) throw new Error("Missing companyId");

  // Validate each industry against the allowed list
  const allowed = INDUSTRIES.map(i => i.id);
  const invalid = industries.filter(i => !allowed.includes(i));

  if (invalid.length > 0) {
    throw new Error(`Invalid industries: ${invalid.join(", ")}`);
  }

  await adminDB.collection("companies").doc(companyId).update({
    industryTypes: industries,
    updatedAt: new Date(),
  });

  return { success: true };
}


"use server";

import { adminDb } from "@/firebase/server";

export async function detectCrossCompanyAbuse(renterId: string) {
  const incidents = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const companies = new Set();
  incidents.docs.forEach(d => companies.add(d.data().companyId));

  return {
    companyCount: companies.size,
    companies: Array.from(companies),
    flag: companies.size >= 3
      ? "Cross-Company Abuse Detected"
      : null
  };
}

"use server";

import { adminDb } from "@/firebase/server";

type AdminDashboardInput = {
  userId: string;
};

export async function getDashboardData({ userId }: AdminDashboardInput) {
  if (!userId?.trim()) {
    throw new Error("userId is required");
  }

  // ----------------------------------
  // Load user to determine company
  // ----------------------------------
  const userSnap = await adminDb.collection("users").doc(userId).get();

  if (!userSnap.exists) {
    throw new Error("User not found");
  }

  const user = userSnap.data();
  const companyId = user?.companyId;

  if (!companyId) {
    throw new Error("User is not associated with a company");
  }

  // ----------------------------------
  // Fetch company data
  // ----------------------------------
  const companySnap = await adminDb
    .collection("companies")
    .doc(companyId)
    .get();

  if (!companySnap.exists) {
    throw new Error("Company not found");
  }

  // ----------------------------------
  // Example metrics (adjust as needed)
  // ----------------------------------
  const reportsSnap = await adminDb
    .collection("reports")
    .where("companyId", "==", companyId)
    .get();

  const casesSnap = await adminDb
    .collection("case_assignments")
    .where("assignedByCompanyId", "==", companyId)
    .get();

  return {
    company: {
      id: companyId,
      ...(companySnap.data() || {}),
    },
    stats: {
      totalReports: reportsSnap.size,
      totalCases: casesSnap.size,
    },
  };
}

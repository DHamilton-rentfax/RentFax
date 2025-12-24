"use server";

import { adminDb } from "@/firebase/server";

type SuperadminDashboardInput = {
  userId: string;
};

export async function getDashboardData({ userId }: SuperadminDashboardInput) {
  if (!userId?.trim()) {
    throw new Error("userId is required");
  }

  // ----------------------------------
  // Optional: verify superadmin role
  // ----------------------------------
  const userSnap = await adminDb.collection("users").doc(userId).get();

  if (!userSnap.exists) {
    throw new Error("User not found");
  }

  const user = userSnap.data();
  if (user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  // ----------------------------------
  // Global metrics
  // ----------------------------------
  const companiesSnap = await adminDb.collection("companies").get();
  const usersSnap = await adminDb.collection("users").get();
  const reportsSnap = await adminDb.collection("reports").get();
  const casesSnap = await adminDb.collection("case_assignments").get();

  return {
    stats: {
      totalCompanies: companiesSnap.size,
      totalUsers: usersSnap.size,
      totalReports: reportsSnap.size,
      totalCases: casesSnap.size,
    },
  };
}

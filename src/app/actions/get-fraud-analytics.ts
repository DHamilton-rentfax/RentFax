'use server';

import { adminDb } from "@/firebase/server";

export async function getFraudAnalytics() {
  try {
    const fraudReportsRef = adminDb.collection("fraudReports");
    const rentersRef = adminDb.collection("renters");

    const highRiskSnapshot = await fraudReportsRef.where("riskLevel", "==", "HIGH").count().get();
    const pendingReviewSnapshot = await fraudReportsRef.where("status", "==", "PENDING_REVIEW").count().get();
    const totalFlaggedSnapshot = await rentersRef.where("isFlagged", "==", true).count().get();

    return {
      highRiskCount: highRiskSnapshot.data().count,
      pendingReviewCount: pendingReviewSnapshot.data().count,
      totalFlaggedCount: totalFlaggedSnapshot.data().count,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching fraud analytics:", error);
    throw new Error("Failed to load fraud analytics data.");
  }
}

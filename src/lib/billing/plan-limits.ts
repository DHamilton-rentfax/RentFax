
import { adminDb } from "@/firebase/server";

export async function getCompanyPlanLimits(companyId: string) {
  const doc = await adminDb.collection("companies").doc(companyId).get();
  const plan = doc.data()?.plan || "free";

  switch (plan) {
    case "free":
      return {
        renterSearch: 1,
        fullReport: 0,
        incidentCreate: 10,
        aiRiskAnalysis: 0,
        verificationAttempt: 3,
      };
    case "starter":
      return {
        renterSearch: 20,
        fullReport: 10,
        incidentCreate: 50,
        aiRiskAnalysis: 20,
        verificationAttempt: 10,
      };
    case "pro":
      return {
        renterSearch: 200,
        fullReport: 100,
        incidentCreate: 500,
        aiRiskAnalysis: 200,
        verificationAttempt: 50,
      };
    case "enterprise":
      return {
        renterSearch: -1,
        fullReport: -1,
        incidentCreate: -1,
        aiRiskAnalysis: -1,
        verificationAttempt: -1,
      };
    default:
      return {};
  }
}

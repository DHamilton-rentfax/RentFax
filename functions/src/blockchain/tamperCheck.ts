import { buildReportHash } from "./utils/reportHash";
import { buildTimelineHash } from "./utils/timelineHash";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export async function detectTampering(reportId: string, storedHash: string) {

  const report = (await db.doc(`reports/${reportId}`).get()).data();
  const incidents = await db.collection("incidents")
    .where("renterId", "==", report.renterId).get();

  const timeline = await db.collection("incident_timelines")
    .where("renterId", "==", report.renterId).get();

  const newReportHash = buildReportHash({
    renterId: report.renterId,
    incidents: incidents.docs.map(x => x.data()),
    riskScore: report.riskScore,
    behaviorScore: report.behaviorScore,
    fraudSignals: report.fraudSignals,
    generatedAt: report.generatedAt
  });

  return {
    tampered: newReportHash !== storedHash,
    storedHash,
    newReportHash
  };
}

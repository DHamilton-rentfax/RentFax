
import { adminDb } from "@/firebase/server";
import { getPublicData } from "@/lib/public-data/getPublicData";
import { getFraudSignals } from "@/lib/fraud/signals";

export async function buildFullReport(renterId: string) {
  // Load renter core record
  const renterSnap = await adminDb.collection("renters").doc(renterId).get();
  if (!renterSnap.exists) {
    return { error: "RENTER_NOT_FOUND" };
  }

  const renter = renterSnap.data() as any;

  // Internal incidents
  const incidentsSnap = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .orderBy("createdAt", "desc")
    .get();

  const incidents = incidentsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Internal disputes
  const disputesSnap = await adminDb
    .collection("disputes")
    .where("renterId", "==", renterId)
    .orderBy("createdAt", "desc")
    .get();

  const disputes = disputesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Public data enrichment
  const publicData = await getPublicData({
    fullName: renter.fullName,
    email: renter.email,
    phone: renter.phone,
    address: renter.address,
  });

  // Fraud engine
  const fraud = await getFraudSignals(renterId);

  // Risk score from 0–100
  const riskScore = calculateRiskScore({
    incidents,
    disputes,
    fraud,
    publicDataMatch: publicData.matchScore,
  });

  return {
    renter,
    incidents,
    disputes,
    publicData,
    fraud,
    riskScore,
    timeline: buildTimeline(incidents, disputes),
  };
}

// RISK SCORE ENGINE (simple version, customizable)
function calculateRiskScore({ incidents, disputes, fraud, publicDataMatch }: any) {
  let score = 100;

  score -= incidents.length * 7;
  score -= disputes.filter((d: any) => d.status === "REJECTED").length * 10;

  if (fraud.flags > 0) score -= fraud.flags * 15;

  if (publicDataMatch < 60) score -= 20;

  return Math.max(0, Math.min(100, score));
}

// TIMELINE BUILDER
function buildTimeline(incidents: any[], disputes: any[]) {
  const timeline: any[] = [];

  incidents.forEach((i) =>
    timeline.push({
      type: "incident",
      date: i.createdAt,
      title: i.title,
      description: i.description,
    })
  );

  disputes.forEach((d) =>
    timeline.push({
      type: "dispute",
      date: d.createdAt,
      title: `Dispute ${d.status}`,
      description: d.claim,
    })
  );

  return timeline.sort((a, b) => b.date - a.date);
}

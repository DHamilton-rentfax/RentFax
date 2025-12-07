import { adminDb } from "@/firebase/server";

export async function buildBehaviorGraph(renterId: string) {
  const incidents = await adminDb.collection("incidents")
    .where("renterId", "==", renterId).get();

  const payments = await adminDb.collection("payments")
    .where("renterId", "==", renterId).get();

  const verifications = await adminDb.collection("verifications")
    .where("renterId", "==", renterId).get();

  const graph = {
    renterId,
    incidents: incidents.docs.map(d => d.data()),
    payments: payments.docs.map(d => d.data()),
    verifications: verifications.docs.map(d => d.data()),
    lastUpdated: new Date(),
  };

  await adminDb.collection("behaviorGraphs")
    .doc(renterId).set(graph);

  return graph;
}

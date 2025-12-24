import { adminDb } from "@/firebase/server";

export async function buildSupportAnalytics(date: string) {
  const start = new Date(`${date}T00:00:00Z`);
  const end = new Date(`${date}T23:59:59Z`);

  // Threads
  const threadsSnap = await adminDb
    .collection("support_threads")
    .where("createdAt", ">=", start)
    .where("createdAt", "<=", end)
    .get();

  let created = threadsSnap.size;
  let resolved = 0;
  let escalations = 0;

  threadsSnap.docs.forEach(d => {
    const t = d.data();
    if (t.status === "closed") resolved++;
    if (t.status === "needs_superadmin") escalations++;
  });

  // SLA breaches
  const auditSnap = await adminDb
    .collection("audit_logs")
    .where("timestamp", ">=", start)
    .where("timestamp", "<=", end)
    .where("eventType", "in", [
      "SLA_RESPONSE_BREACHED",
      "SLA_RESOLUTION_BREACHED",
    ])
    .get();

  const responseBreaches = auditSnap.docs.filter(
    d => d.data().eventType === "SLA_RESPONSE_BREACHED"
  ).length;

  const resolutionBreaches = auditSnap.docs.filter(
    d => d.data().eventType === "SLA_RESOLUTION_BREACHED"
  ).length;

  await adminDb.collection("analytics_support_daily").doc(date).set({
    date,
    threadsCreated: created,
    threadsResolved: resolved,
    slaResponseBreaches: responseBreaches,
    slaResolutionBreaches: resolutionBreaches,
    escalations,
    createdAt: new Date(),
  });
}
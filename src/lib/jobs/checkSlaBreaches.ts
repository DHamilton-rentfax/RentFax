export async function checkSlaBreaches() {
  const now = new Date();

  const snap = await adminDb
    .collection("support_threads")
    .where("status", "!=", "closed")
    .get();

  for (const doc of snap.docs) {
    const data = doc.data();
    if (!data.sla) continue;

    const updates: any = {};
    const events: string[] = [];

    if (!data.sla.breachedResponse && now > data.sla.responseDueAt.toDate()) {
      updates["sla.breachedResponse"] = true;
      events.push("SLA_RESPONSE_BREACHED");
    }

    if (!data.sla.breachedResolution && now > data.sla.resolutionDueAt.toDate()) {
      updates["sla.breachedResolution"] = true;
      events.push("SLA_RESOLUTION_BREACHED");
    }

    if (events.length) {
      await doc.ref.update(updates);

      for (const e of events) {
        /*
        await logEvent({
          eventType: e,
          severity: "warning",
          targetCollection: "support_threads",
          targetId: doc.id,
        });
        */
      }

      // escalate
      await escalateThreadIfNeeded(doc.id, data, events);
    }
  }
}

async function escalateThreadIfNeeded(threadId, thread, events) {
  if (events.includes("SLA_RESPONSE_BREACHED")) {
    /*
    await notifyEscalation({
      role: "SUPPORT_ADMIN",
      threadId,
      reason: "Response SLA breached",
    });
    */
  }

  if (events.includes("SLA_RESOLUTION_BREACHED")) {
    /*
    await notifyEscalation({
      role: "SUPER_ADMIN",
      threadId,
      reason: "Resolution SLA breached",
    });
    */
  }
}
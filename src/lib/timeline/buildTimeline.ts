import { EVENT_META, TimelineEventType } from "./eventTypes";
import { Timestamp } from "firebase-admin/firestore";

export type TimelineEntry = {
  id: string;
  type: TimelineEventType;
  label: string;
  description?: string;
  createdAt: number;
  metadata?: Record<string, any>;
};

export function buildTimeline({
  incidents,
  disputes,
  payments,
  verifications,
  flags,
  overrides,
  freezes,
}: {
  incidents: any[];
  disputes: any[];
  payments: any[];
  verifications: any[];
  flags: any[];
  overrides: any[];
  freezes: any[];
}): TimelineEntry[] {
  const events: TimelineEntry[] = [];

  /* ------------------------- INCIDENTS --------------------------- */
  incidents.forEach((i) => {
    events.push({
      id: `incident-${i.id}`,
      type: "incident_reported",
      label: EVENT_META.incident_reported.label,
      createdAt: i.createdAt?.toMillis?.() ?? Date.now(),
      metadata: i,
    });

    if (i.resolvedAt) {
      events.push({
        id: `incident-resolved-${i.id}`,
        type: "incident_resolved",
        label: EVENT_META.incident_resolved.label,
        createdAt: i.resolvedAt.toMillis(),
        metadata: i,
      });
    }
  });

  /* ------------------------- DISPUTES --------------------------- */
  disputes.forEach((d) => {
    events.push({
      id: `dispute-${d.id}`,
      type: "dispute_opened",
      label: EVENT_META.dispute_opened.label,
      createdAt: d.createdAt.toMillis(),
      metadata: d,
    });

    if (d.status === "approved" || d.status === "rejected") {
      events.push({
        id: `dispute-resolved-${d.id}`,
        type: "dispute_resolved",
        label: EVENT_META.dispute_resolved.label,
        createdAt: d.reviewedAt?.toMillis?.() ?? Date.now(),
        metadata: d,
      });
    }
  });

  /* ------------------------- PAYMENTS --------------------------- */
  payments.forEach((p) => {
    events.push({
      id: `payment-${p.id}`,
      type: p.status === "paid" ? "payment_made" : "payment_missed",
      label:
        p.status === "paid"
          ? EVENT_META.payment_made.label
          : EVENT_META.payment_missed.label,
      createdAt: p.createdAt.toMillis(),
      metadata: p,
    });
  });

  /* ------------------------- VERIFICATIONS --------------------------- */
  verifications.forEach((v) => {
    events.push({
      id: `verification-${v.id}`,
      type: "verification_submitted",
      label: EVENT_META.verification_submitted.label,
      createdAt: v.createdAt.toMillis(),
      metadata: v,
    });

    if (v.status === "approved") {
      events.push({
        id: `verification-approved-${v.id}`,
        type: "verification_approved",
        label: EVENT_META.verification_approved.label,
        createdAt: v.reviewedAt.toMillis(),
        metadata: v,
      });
    }
    if (v.status === "rejected") {
      events.push({
        id: `verification-rejected-${v.id}`,
        type: "verification_rejected",
        label: EVENT_META.verification_rejected.label,
        createdAt: v.reviewedAt.toMillis(),
        metadata: v,
      });
    }
  });

  /* --------------------- FLAGS + FREEZES + OVERRIDES ---------------------- */
  flags.forEach((f) =>
    events.push({
      id: `flag-${f.id}`,
      type: "renter_flagged_high_risk",
      label: EVENT_META.renter_flagged_high_risk.label,
      createdAt: f.createdAt.toMillis(),
      metadata: f,
    })
  );

  freezes.forEach((fr) =>
    events.push({
      id: `freeze-${fr.id}`,
      type: fr.action === "freeze" ? "renter_frozen" : "renter_unfrozen",
      label:
        fr.action === "freeze"
          ? EVENT_META.renter_frozen.label
          : EVENT_META.renter_unfrozen.label,
      createdAt: fr.createdAt.toMillis(),
      metadata: fr,
    })
  );

  overrides.forEach((o) =>
    events.push({
      id: `override-${o.id}`,
      type: "admin_override",
      label: EVENT_META.admin_override.label,
      createdAt: o.createdAt.toMillis(),
      metadata: o,
    })
  );

  /* ---------------------- FINAL SORT -------------------------- */
  return events.sort((a, b) => b.createdAt - a.createdAt);
}

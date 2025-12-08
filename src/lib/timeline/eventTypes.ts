export type TimelineEventType =
  | "incident_reported"
  | "incident_resolved"
  | "dispute_opened"
  | "dispute_resolved"
  | "payment_made"
  | "payment_missed"
  | "verification_submitted"
  | "verification_approved"
  | "verification_rejected"
  | "renter_flagged_high_risk"
  | "renter_frozen"
  | "renter_unfrozen"
  | "admin_override"
  | "system_event";

export const EVENT_META: Record<
  TimelineEventType,
  { color: string; icon: string; label: string }
> = {
  incident_reported: {
    color: "red",
    icon: "AlertTriangle",
    label: "Incident Reported",
  },
  incident_resolved: {
    color: "green",
    icon: "CheckCircle",
    label: "Incident Resolved",
  },
  dispute_opened: {
    color: "yellow",
    icon: "MessageCircle",
    label: "Dispute Opened",
  },
  dispute_resolved: {
    color: "blue",
    icon: "ClipboardCheck",
    label: "Dispute Resolved",
  },
  payment_made: {
    color: "green",
    icon: "DollarSign",
    label: "Payment Made",
  },
  payment_missed: {
    color: "red",
    icon: "XCircle",
    label: "Payment Missed",
  },
  verification_submitted: {
    color: "blue",
    icon: "UserCheck",
    label: "Verification Submitted",
  },
  verification_approved: {
    color: "green",
    icon: "ShieldCheck",
    label: "Verification Approved",
  },
  verification_rejected: {
    color: "red",
    icon: "ShieldX",
    label: "Verification Rejected",
  },
  renter_flagged_high_risk: {
    color: "red",
    icon: "Flame",
    label: "Flagged High Risk",
  },
  renter_frozen: {
    color: "blue",
    icon: "Snowflake",
    label: "Account Frozen",
  },
  renter_unfrozen: {
    color: "green",
    icon: "Unlock",
    label: "Account Unfrozen",
  },
  admin_override: {
    color: "purple",
    icon: "Gavel",
    label: "Admin Override",
  },
  system_event: {
    color: "gray",
    icon: "Info",
    label: "System Event",
  },
};

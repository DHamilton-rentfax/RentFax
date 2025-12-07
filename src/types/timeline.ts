export type RenterTimelineEventType =
  | "INCIDENT_REPORTED"
  | "INCIDENT_RESOLVED"
  | "DISPUTE_SUBMITTED"
  | "DISPUTE_RESOLVED"
  | "PAYMENT_ON_TIME"
  | "PAYMENT_LATE"
  | "VERIFICATION_APPROVED"
  | "VERIFICATION_FAILED"
  | "NOTE_ADDED";

export type RenterTimelineEventSeverity =
  | "POSITIVE"
  | "NEGATIVE"
  | "NEUTRAL";

export interface RenterTimelineEvent {
  id: string;
  renterId: string;
  companyId?: string;
  type: RenterTimelineEventType;
  severity: RenterTimelineEventSeverity;
  label: string;        // short label shown in UI
  description?: string; // 1–2 sentence factual note
  refCollection?: string;
  refId?: string;
  createdAt: string;    // ISO string
  createdByUserId?: string;
}

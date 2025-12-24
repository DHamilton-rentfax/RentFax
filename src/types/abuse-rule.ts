
export type AbuseAction = "THROTTLE" | "BLOCK" | "ALERT";

export interface AbuseRule {
  id: string;
  pattern: "EXCESSIVE_SEARCHES" | "EXCESSIVE_DISPUTES" | "EVIDENCE_SPAM" | "API_MISUSE";
  threshold: number;
  windowMinutes: number;
  action: AbuseAction;
  enabled: boolean;
}

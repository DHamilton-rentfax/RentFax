// src/lib/billing/usage-types.ts

export type UsageEventType =
  | "renterSearch"
  | "fullReport"
  | "incidentCreate"
  | "disputeCreate"
  | "aiRiskAnalysis"
  | "verificationAttempt"       // renter self-verification + ID checks
  | "identityCheck"             // $4.99 Stripe identity check
  | "evidenceUploadMB"
  | "apiRequest"
  | "fraudScan";

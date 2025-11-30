// src/lib/verification/types.ts

export type VerificationLevel = "UNVERIFIED" | "PENDING" | "BASIC" | "FULL";

export interface VerificationState {
  level: VerificationLevel;
  /**
   * e.g. "Unverified: identity pending", "Pending: review in progress", "Verified (Basic)"
   */
  label: string;
  /**
   * True when renter has uploaded an ID document.
   */
  hasId: boolean;
  /**
   * True when renter has provided a selfie that matches ID.
   */
  hasSelfie: boolean;
  /**
   * Optional extra info (reasons, last failure, etc.)
   */
  reason?: string;
  
  // Matches the Firestore schema for verification data
  verificationFiles?: {
    selfieUrl?: string;
    idFrontUrl?: string;
    idBackUrl?: string;
    addressProofUrl?: string;
  };
  verificationSubmittedAt?: string;
  verificationReviewedAt?: string;
  verificationReviewedBy?: string; // Admin UID
  verificationNotes?: string;
  verificationConfidenceScore?: number;
}

export function getVerificationLabel(level: VerificationLevel): string {
  switch (level) {
    case "UNVERIFIED":
      return "Unverified: identity pending";
    case "PENDING":
      return "Pending: review in progress";
    case "BASIC":
      return "Verified (Basic)";
    case "FULL":
      return "Verified (Full)";
    default:
      return "Unverified: identity pending";
  }
}

export function canFileDispute(level: VerificationLevel): boolean {
  // Disputes are allowed at all levels
  return true;
}

/**
 * For weighting / trust scoring in your dispute engine
 */
export function getDisputeTrustWeight(level: VerificationLevel): "LOW" | "MEDIUM" | "HIGH" {
  switch (level) {
    case "UNVERIFIED":
    case "PENDING":
      return "LOW";
    case "BASIC":
      return "MEDIUM";
    case "FULL":
      return "HIGH";
  }
}

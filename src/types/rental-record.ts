// src/types/rental-record.ts
export type RentalOutcome =
  | "COMPLETED_NO_ISSUES"
  | "COMPLETED_MINOR_ISSUES"
  | "COMPLETED_MAJOR_ISSUES"
  | "DENIED_OR_NOT_COMPLETED";

export type PerformanceSignal =
  | "ON_TIME_PAYMENTS"
  | "CLEAN_RETURN"
  | "NO_DAMAGE"
  | "NO_DISPUTES"
  | "LATE_PAYMENT"
  | "CLEANING_REQUIRED"
  | "MINOR_DAMAGE"
  | "MAJOR_DAMAGE"
  | "POLICY_VIOLATION"
  | "ACCIDENT_INCIDENT";

export type RentalContext = {
  rentalType: "Apartment" | "Vehicle" | "Equipment" | "Other";
  rentalDuration: "<30 days" | "1–6 months" | "6+ months";
  paymentFrequency: "Weekly" | "Monthly" | "Other";
};

export type FinalRentalRecordDraft = {
  outcome: RentalOutcome | null;
  signals: PerformanceSignal[];
  context: RentalContext;
  internalNotes?: string;
  consent: boolean;
};

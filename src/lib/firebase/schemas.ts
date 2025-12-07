/**
 * @description Defines the schema for the feature flags document in Firestore.
 */
export type FeatureFlags = {
  enableConfidenceScore: boolean; // Master switch for the entire feature
  showConfidenceInAdmin: boolean; // Show in Super Admin UI
  showConfidenceToLandlords: boolean; // Show in landlord-facing reports
};

/**
 * @description Defines the schema for the audit log documents in Firestore.
 */
export type AuditLog = {
  type: string; // e.g., 'RENTER_MERGED', 'FEATURE_FLAGS_UPDATED'
  superAdminId: string;
  timestamp: number;
  [key: string]: any; // For other event-specific data
};

/**
 * @description Defines the schema for the renter documents in Firestore.
 */
export type Renter = {
  // ... existing renter fields
  highRisk?: boolean;
  highRiskReason?: string;
  highRiskUpdatedAt?: number;
  mergedInto?: string;
  active?: boolean;
  updatedAt?: number;
};

/**
 * @description Defines the schema for the report documents in Firestore.
 */
export type Report = {
  // ... existing report fields
  frozen?: boolean;
  frozenReason?: string;
  frozenUpdatedAt?: number;
};

/**
 * @description Defines the schema for the report notes documents in Firestore.
 */
export type ReportNote = {
  reportId: string;
  note: string;
  superAdminId: string;
  createdAt: number;
};

export interface CompanyReputationInputs {
  companyId: string;

  // Behavior Metrics
  incidentsFiled: number;
  severeIncidents: number;
  disputesResolved: number;
  disputesIgnored: number;

  // Renter Complaints (Structured Only)
  complaintsReceived: number;
  complaintsResolved: number;

  // Operational Quality
  maintenanceResponseTime?: number;  // hours
  customerServiceRating?: number;    // 1–5
  refundRate?: number;               // percent
  errorCorrections?: number;         // mistaken reports they fixed

  // Compliance & Verification
  verifiedBusiness: boolean;
  insuranceVerified: boolean;
  fairHousingCompliant: boolean;

  updatedAt: string;
}

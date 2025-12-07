export interface CompanyBehaviorMetrics {
  companyId: string;

  totalIncidents: number;
  severeIncidents: number;
  moderateIncidents: number;

  disputesOpened: number;
  disputesResolved: number;
  disputesPending: number;

  complaintsReceived: number;
  complaintsResolved: number;

  avgMaintenanceResponseTime?: number; // hours
  avgResponseToRenter?: number; // hours

  verificationStatus: boolean;  // business verified
  insuranceStatus: boolean;      // insurance verified
  fairHousingStatus: boolean;    // compliance set

  transparencyScore?: number;    // internal-only
  updatedAt: string;
}

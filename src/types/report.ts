import { IdentityVerificationResult } from "./identity";
import { FraudSummary } from "./fraud";
import { PublicDataSummary } from "./public-data";

export interface IncidentEntry {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  amount?: number;
  createdAt: number;
  resolved?: boolean;
}

export interface ReportSummary {
  renterId: string;
  renterName: string;
  createdAt: number;

  riskScore: number;
  confidence: number;

  incidentsCount: number;
  fraudFlagCount: number;
}

export interface FullReport {
  id: string;
  renterId: string;

  profile: {
    fullName: string;
    email?: string;
    phone?: string;
    address?: string;
    licenseNumber?: string;
  };

  identity: IdentityVerificationResult | null;
  fraud: FraudSummary | null;
  publicData: PublicDataSummary | null;

  incidents: IncidentEntry[];

  summary: ReportSummary;

  createdAt: number;
  updatedAt: number;
}
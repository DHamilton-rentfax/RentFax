export interface SearchPayload {
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  licenseNumber?: string;
}

export interface SearchResultMatch {
  renterId: string;
  renterName: string;
  confidence: number;

  aiSummary?: string;
  aiRiskScore?: number;

  fraudSignals?: string[];
  riskScore?: number;

  matchedFields?: {
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    address?: boolean;
    license?: boolean;
  };
}

export interface SearchResult {
  preMatchedReportId?: string;
  matched: boolean;
  matches: SearchResultMatch[];
}
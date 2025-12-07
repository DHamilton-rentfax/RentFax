export interface IdentityProfile {
  renterId: string;

  // DOCUMENT IDENTITY
  name: string;
  dob: string;
  dlHash?: string;
  idNumber?: string;

  // DIGITAL IDENTITY
  phone?: string;
  email?: string;
  deviceIds?: string[];

  // LOCATION IDENTITY
  address?: string;
  addressHistory?: string[];

  // BIOMETRIC IDENTITY
  faceMatchScore?: number;
  liveness?: boolean;

  // BEHAVIORAL IDENTITY
  incidents: number;
  industries: string[];
  crossIndustryRiskScore: number;
  crossIndustryTier: string;

  // FRAUD IDENTITY
  shadowConnections: string[];
  clusterId?: string;

  // CONFIDENCE SCORE (Shadow Identity Rating)
  identityConfidence: number;
}

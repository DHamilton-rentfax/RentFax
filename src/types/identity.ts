export interface OcrResult {
  fullName: string | null;
  dob: string | null;
  address: string | null;
  licenseNumber: string | null;
  expiration: string | null;
}

export interface FaceMatchResult {
  score: number;
  tier: "PASS_STRONG" | "PASS_WEAK" | "REVIEW_REQUIRED" | "FAIL";
  risk: "low" | "medium" | "high" | "critical";
  message: string;
}

export interface PublicRecordHit {
  source: string;
  confidence: number;
}

export interface PublicRecordResult {
  matches: PublicRecordHit[];
}

export interface IdentityVerificationResult {
  ocr: OcrResult;
  face: FaceMatchResult;
  publicData: PublicRecordResult | null;
  fraud: {
    fraudScore: number;
    fraudSignals: FraudSignal[];
  };
  finalScore: number;
  verified: boolean;
}

export interface FraudSignal {
  id: string;
  label: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface IdentityCheck {
  id: string;
  companyId: string;
  renterId?: string;                     // If internal match found
  fullName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber?: string;
  licenseHash?: string;

  status: "pending_review" | "verified" | "rejected";

  submittedAt: number;
  completedAt?: number;
  adminReviewed: boolean;                // For future strict mode
  initiatedBy: string;                   // landlord / company user id
  paid: boolean;                         // $4.99 for identity check

  uploads: {
    frontId?: string;
    backId?: string;
    selfie?: string;
  };

  scoring: {
    identityScore: number;
    fraudScore: number;
    confidence: number;
  };
}
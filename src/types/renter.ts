export type VerificationMethod = "pdl" | "self" | null;

export type VerificationStatus = "unverified" | "verified";

export interface Renter {
  id: string;

  // NEW — Human-friendly global identifier
  memberId: string;

  // Verification
  verificationStatus: VerificationStatus;
  verificationMethod: VerificationMethod;
  verifiedAt?: number;

  // Existing fields (do not remove)
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  licenseNumber?: string;

  createdAt: number;
}

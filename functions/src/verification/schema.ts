export interface RenterVerification {
  renterId: string;
  status: "unverified" | "pending" | "verified" | "failed";
  idType?: "drivers_license" | "passport" | "id_card";
  idCountry?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  selfieUrl?: string;
  livenessScore?: number;
  spoofRisk?: number;
  incodeSessionId?: string;
  verificationReport?: any;
  verifiedAt?: number;
  createdAt: number;
  updatedAt: number;
}
